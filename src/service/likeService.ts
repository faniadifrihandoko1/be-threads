import { Equal, Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import { redisClient } from "../lib/redis";

export default new (class likeService {
  private readonly likeRepository: Repository<Like> =
    AppDataSource.getRepository(Like);

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.likeRepository
        .createQueryBuilder()
        .leftJoinAndSelect("like.user", "user")
        .getMany();
      return res.status(200).json({
        message: "success",
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getLikeByUser(threadId: number, userId: Number) {
    const response = await this.likeRepository
      .createQueryBuilder("like")
      .where({ thread: threadId, user: userId })
      .getOne();

    if (response) {
      return true;
    } else {
      return false;
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      data.user = res.locals.loginSession.id;
      data.thread = Number(req.params.id);
      // Mengecek apakah like sudah ada sebelumnya
      const existingLike = await this.likeRepository.findOne({
        where: {
          user: {
            id: Equal(data.user),
          },
          thread: {
            id: Equal(data.thread),
          },
        },
      });

      if (existingLike) {
        // Jika like sudah ada, maka hapus (unlike)
        const unlikeResponse = await this.likeRepository.remove(existingLike);

        return res.status(200).json({
          message: "unliked",
          response: unlikeResponse,
        });
      } else {
        // Jika like belum ada, maka tambahkan (like)
        const likeResponse = await this.likeRepository
          .createQueryBuilder()
          .insert()
          .into(Like)
          .values(data)
          .execute();
        return res.status(200).json({
          message: "liked",
          response: likeResponse,
        });
      }
    } catch (error) {
      return res.status(500).json(error);
    }
  }
})();
