import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Following } from "../entities/Following";
import { Request, Response } from "express";
import { json } from "stream/consumers";

export default new (class followService {
  private readonly followRepository: Repository<Following> =
    AppDataSource.getRepository(Following);

  async create(reqBody: any, loginSession: any): Promise<any> {
    try {
      const isFollowExist = await this.followRepository.count({
        where: {
          Following: {
            id: reqBody.following,
          },
          Follower: {
            id: loginSession.id,
          },
        },
      });

      if (isFollowExist > 0) {
        throw new Error("Already follow");
      }

      if (reqBody.following === loginSession.id) {
        throw new Error("You can't follow yourself");
      }

      const follow = this.followRepository.create({
        Follower: {
          id: loginSession.id,
        },
        Following: {
          id: reqBody.following,
        },
      });

      // has delete follow

      const responseFollow = await this.followRepository.save(follow);
      return {
        message: "Success follow",
        data: responseFollow,
      };
    } catch (error) {
      throw new Error(error);
    }
  }

  async ngefollow(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    data.follower = res.locals.loginSession.id;
    console.log(data.follower);

    const response = await this.followRepository.findOne({
      where: {
        // nama saua adalagbvb aldfag suri zwegta kjw2kwkwk
      },
    });

    // const follow = await this.followRepository.create({
    //   Follower: data.follower,
    //   Following: data.following,
    // });
    // const sayaNgefollow = await this.followRepository.save(follow);
    return res.status(200).json({ message: "follow" });
  }
})();
