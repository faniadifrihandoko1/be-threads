import { Request, Response } from "express";
import threadService from "../service/threadService";

export default new (class threadController {
  findAll(req: Request, res: Response) {
    threadService.findAll(req, res);
  }

  create(req: Request, res: Response) {
    threadService.create(req, res);
  }

  update(req: Request, res: Response) {
    threadService.update(req, res);
  }

  delete(req: Request, res: Response) {
    threadService.delete(req, res);
  }
})();