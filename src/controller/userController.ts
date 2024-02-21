import { Request, Response } from "express";
import userService from "../service/userService";

export default new (class userController {
  update(req: Request, res: Response) {
    userService.update(req, res);
  }

  getCurrent(req: Request, res: Response) {
    userService.getCurrent(req, res);
  }

  check(req: Request, res: Response) {
    userService.check(req, res);
  }
})();
