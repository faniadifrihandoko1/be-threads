import { Request, Response } from "express";
import likeService from "../service/likeService";

export default new (class likeController {
  getall(req: Request, res: Response) {
    likeService.getAll(req, res);
  }

  create(req: Request, res: Response) {
    likeService.create(req, res);
  }
})();
