import { Repository } from "typeorm";
import { Like } from "../entities/Like";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

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

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      data.user = res.locals.loginSession.id;

      // Mengecek apakah like sudah ada sebelumnya
      const existingLike = await this.likeRepository.findOne({
        where: {
          user: data.user,
          thread: data.thread,
        },
      });

      if (existingLike) {
        // Jika like sudah ada, maka hapus (unlike)
        const unlikeResponse = await this.likeRepository
          .createQueryBuilder()
          .delete()
          .from(Like)
          .where("user = :userId", { userId: data.user })
          .andWhere("thread = :threadId", { threadId: data.thread })
          .execute();

        console.log(`unlikeResponse`, unlikeResponse);

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

        console.log(`likeResponse`, likeResponse);

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
