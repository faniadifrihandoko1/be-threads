import { Request, Response } from "express";
import userService from "../service/userService";

export default new (class userController {
  getUserById(req: Request, res: Response) {
    userService.getUserById(req, res);
  }
  update(req: Request, res: Response) {
    userService.update(req, res);
  }

  updateCover(req: Request, res: Response) {
    userService.updateCover(req, res);
  }

  getCurrent(req: Request, res: Response) {
    userService.getCurrent(req, res);
  }

  check(req: Request, res: Response) {
    userService.check(req, res);
  }
})();
