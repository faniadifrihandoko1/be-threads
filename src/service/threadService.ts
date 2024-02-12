import { Repository } from "typeorm";
import { Thread } from "../entities/Thread";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class threadService {
  private readonly threadRepository: Repository<Thread> =
    AppDataSource.getRepository(Thread);

  async findAll(req: Request, res: Response): Promise<Response> {
    try {
      const response = await this.threadRepository.find();
      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
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
      .from(Thread)
      .where({ id })
      .execute();
    if (!response) {
      return res.status(404).json({ message: `Thread ${id} not found` });
    }
    console.log(response);
    return res.status(200).json({ message: "delete data berhasil" });
  }
})();
