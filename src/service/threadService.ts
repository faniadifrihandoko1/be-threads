import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Reply } from "../entities/Reply";
import cloudinary from "../lib/cloudinary";
import likeService from "./likeService";
import { Like } from "../entities/Like";
import { number } from "joi";

export default new (class threadService {
  private readonly threadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);

  private readonly likeRepository: Repository<Like> =
    AppDataSource.getRepository(Like);

  async getThreadByUser(req: Request, res: Response): Promise<Response> {
    const userId = res.locals.loginSession.id;
    const response = await this.threadRepository
      .createQueryBuilder("thread")
      .orderBy("thread.created_at", "DESC")
      .where({ user: { id: userId } })
      .leftJoinAndSelect("thread.user", "user")
      .leftJoinAndSelect("thread.reply", "reply")
      .leftJoinAndSelect("reply.user", "replyUser")
      .leftJoinAndSelect("thread.like", "like")
      .leftJoinAndSelect("like.user", "userLike")
      .select([
        "thread",
        "user.id",
        "user.fullName",
        "user.username",
        "user.email",
        "user.photo_profile",
        "reply.id",
        "reply.content",
        "reply.image",
        "reply.created_at",
        "reply.updated_at",
        "replyUser.id",
        "replyUser.fullName",
        "replyUser.username",
        "replyUser.photo_profile",
        "like.id",
        "userLike.id",
      ])
      .loadRelationCountAndMap("thread.reply_count", "thread.reply")
      .loadRelationCountAndMap("thread.like_count", "thread.like")
      .getMany();

    const likes = response.map(async (item) => {
      return await likeService.getLikeByUser(item.id, Number(userId));
    });

    const resolvedLikes = await Promise.all(likes);
    const threads = [];
    let i = 0;
    for (i; i < response.length; i++) {
      threads.push({
        id: response[i].id,
        content: response[i].content,
        image: response[i].image,
        reply_count: response[i].reply.length,
        like_count: response[i].like.length,
        created_at: response[i].created_at,
        updated_at: response[i].updated_at,
        isLiked: resolvedLikes[i],
        user: response[i].user,
        like: response[i].like,
        reply: response[i].reply,
      });
    }

    return res.status(200).json(await Promise.all(threads));
  }
  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      // const isLikeThread = await likeService.getLikeByUser(response)
      const userId = req.query.id;

      const response = await this.threadRepository
        .createQueryBuilder("thread")
        .orderBy("thread.created_at", "DESC")
        .leftJoinAndSelect("thread.user", "user")
        .leftJoinAndSelect("thread.reply", "reply")
        .leftJoinAndSelect("reply.user", "replyUser")
        .leftJoinAndSelect("thread.like", "like")
        .leftJoinAndSelect("like.user", "userLike")

        .select([
          "thread",
          "user.id",
          "user.fullName",
          "user.username",
          "user.email",
          "user.photo_profile",
          "reply.id",
          "reply.content",
          "reply.image",
          "reply.created_at",
          "reply.updated_at",
          "replyUser.id",
          "replyUser.fullName",
          "replyUser.username",
          "replyUser.photo_profile",
          "like.id",
          "userLike.id",
        ])
        .loadRelationCountAndMap("thread.reply_count", "thread.reply")
        .loadRelationCountAndMap("thread.like_count", "thread.like")
        .getMany();

      const likes = response.map(async (item) => {
        return await likeService.getLikeByUser(item.id, Number(userId));
      });

      const resolvedLikes = await Promise.all(likes);
      const threads = [];
      let i = 0;
      for (i; i < response.length; i++) {
        threads.push({
          id: response[i].id,
          content: response[i].content,
          image: response[i].image,
          reply_count: response[i].reply.length,
          like_count: response[i].like.length,
          created_at: response[i].created_at,
          updated_at: response[i].updated_at,
          isLiked: resolvedLikes[i],
          user: response[i].user,
          like: response[i].like,
          reply: response[i].reply,
        });
      }

      return res.status(200).json(await Promise.all(threads));
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      data.user = res.locals.loginSession.id;
      let img = null;

      if (req.file) {
        data.image = res.locals.filename;
        const cloud = await cloudinary.destination(data.image);
        data.image = cloud;
      } else {
        data.image = img;
      }

      const response = await this.threadRepository
        .createQueryBuilder()
        .insert()
        .into(Thread)
        .values(data)
        .execute();
      return res.status(200).json({
        message: "post thread success",
        data,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async update(req: Request, res: Response): Promise<Response> {
    const id = parseInt(req.params.id);
    const data = req.body;
    const response = await this.threadRepository
      .createQueryBuilder()
      .update(Thread)
      .set(data)
      .where({ id })
      .execute();

    if (response.affected == 1) {
      return res.status(200).json({ message: "update success" });
    } else {
      return res.status(404).json({ message: `Thread ${id} not found` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const userLogin = res.locals.loginSession;
    const ThreadId = await this.threadRepository
      .createQueryBuilder("thread")
      .leftJoinAndSelect("thread.user", "user")
      .where({ id })
      .getMany();

    if (ThreadId[0].user.id == userLogin.id) {
      const response = await this.threadRepository
        .createQueryBuilder()
        .delete()
        .from(Thread)
        .where({ id })
        .execute();
      return res.status(200).json({ message: "delete data berhasil" });
    } else {
      return res.status(404).json({ message: `delete tidak bisa` });
    }

    // const response = await this.threadRepository
    //   .createQueryBuilder()
    //   .delete()
    //   .from(Reply)
    //   .where({ id })
    //   .execute();

    // if (response.affected == 1) {
    //   return res.status(200).json({ message: "delete data berhasil" });
    // } else {
    //   return res.status(404).json({ message: `Thread ${id} not found` });
    // }
  }
})();
