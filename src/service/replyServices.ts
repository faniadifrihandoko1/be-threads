import { Repository } from "typeorm";
import { Reply } from "../entities/Reply";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class replyService {
  private readonly replyRepository: Repository<Reply> =
    AppDataSource.getRepository(Reply);

  async getAll(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.replyRepository
        .createQueryBuilder()
        .getMany();

      return res.status(200).json({
        message: "success",
        data: response,
      });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      data.user = res.locals.loginSession.id;
      data.thread = Number(req.body.thread);

      const response = await this.replyRepository
        .createQueryBuilder()
        .insert()
        .into(Reply)
        .values(data)
        .execute();

      console.log(`response:`, response);
      return res.status(200).json({
        message: "success",
        data: response,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json(error);
    }
  }
})();
