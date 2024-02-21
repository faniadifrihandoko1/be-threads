import { Request, Response } from "express";
import followService from "../service/followService";

export default new (class followController {
  kitaNgeFollowOrang(req: Request, res: Response) {
    followService.ngefollow(req, res);
  }
})();
