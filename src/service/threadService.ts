import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { Reply } from "../entities/Reply";
import cloudinary from "../lib/cloudinary";

export default new (class threadService {
  private readonly threadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
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
          "like.id",
          "userLike.id",
        ])
        .getMany();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      data.user = res.locals.loginSession.id;
      let img = null;
      console.log(`req file`, req.file);
      if (req.file) {
        data.image = res.locals.filename;
        const cloud = await cloudinary.destination(data.image);
        data.image = cloud;
      } else {
        data.image = img;
      }

      // const uploadFile = await cloudinary.destination(res.locals.fileName);
      // let data;
      // // console.log(`data image`, data.image);
      // if (!res.locals.fileName) {
      //   data = {
      //     content: req.body.content,
      //     user: res.locals.loginSession.id,
      //   };
      // } else {
      //   data = {
      //     content: req.body.content,
      //     image: uploadFile,
      //     user: res.locals.loginSession.id,
      //   };
      // }

      // console.log(data);
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
    console.log(response);

    if (response.affected == 1) {
      return res.status(200).json({ message: "update success" });
    } else {
      return res.status(404).json({ message: `Thread ${id} not found` });
    }
  }

  async delete(req: Request, res: Response): Promise<Response> {
    const id = Number(req.params.id);
    const response = await this.threadRepository
      .createQueryBuilder()
      .delete()
      .from(Reply)
      .where({ id })
      .execute();

    if (response.affected == 1) {
      return res.status(200).json({ message: "delete data berhasil" });
    } else {
      return res.status(404).json({ message: `Thread ${id} not found` });
    }
  }
})();
