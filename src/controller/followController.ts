import { Request, Response } from "express";
import followService from "../service/followService";

export default new (class followController {
  follow(req: Request, res: Response) {
    followService.follow(req, res);
  }

  find(req: Request, res: Response) {
    followService.find(req, res);
  }

  async create(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const userId = res.locals.loginSession;

      const response = await followService.create(data, userId);

      return res.status(200).json(response);
    } catch (error) {
      return res.status(500).json({ message: error });
    }
  }

  // check data following kita check id kita di
})();
