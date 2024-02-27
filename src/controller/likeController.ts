import { Request, Response } from "express";
import likeService from "../service/likeService";
import { number } from "joi";

export default new (class likeController {
  getall(req: Request, res: Response) {
    likeService.getAll(req, res);
  }

  create(req: Request, res: Response) {
    likeService.create(req, res);
  }

  async getLikeByUser(req: Request, res: Response): Promise<Response> {
    try {
      const threadId = Number(req.params.id);
      console.log(`thread`, threadId);
      const userId = res.locals.loginSession.id;

      const response = await likeService.getLikeByUser(threadId, userId);
      return res.status(200).json({ message: "success" });
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }
})();
