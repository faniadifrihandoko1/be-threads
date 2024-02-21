import { Request, Response } from "express";
import replyServices from "../service/replyServices";

export default new (class replyController {
  getAll(req: Request, res: Response) {
    replyServices.getAll(req, res);
  }

  create(req: Request, res: Response) {
    replyServices.create(req, res);
  }

  delete(req: Request, res: Response) {
    replyServices.delete(req, res);
  }
})();
