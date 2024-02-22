import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";

export default new (class userService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const id = parseInt(req.params.id);
      const response = await this.userRepository
        .createQueryBuilder()
        .update(User)
        .set(data)
        .where({ id })
        .execute();
      console.log(`ini data`, data);
      console.log(`ini response`, response);
      return res
        .status(200)
        .json({ message: "update success", data: response });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getCurrent(req: Request, res: Response): Promise<Response> {
    try {
      const response = res.locals.loginSession.id;
      const getData = await this.userRepository
        .createQueryBuilder()
        .leftJoinAndSelect("User.following", "following")
        .leftJoinAndSelect("User.follower", "follower")
        .where({ id: response })
        .getOne();
      console.log(response);
      return res.status(200).json({ message: "success", data: getData });
    } catch (error) {
      res.status(500).json(error);
      console.log(error);
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    const userLogin = res.locals.loginSession.id;
    const response = await this.userRepository
      .createQueryBuilder()
      .where({
        id: userLogin,
      })
      .getOne();
    console.log(response);
    return res.status(200).json({
      message: "success",
      data: {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        photo_profile: response.photo_profile,
        bio: response.bio,
        username: response.username,
      },
    });
  }
})();
