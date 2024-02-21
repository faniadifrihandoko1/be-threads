import { Repository } from "typeorm";
import { AppDataSource } from "../data-source";
import { Following } from "../entities/Following";
import { Request, Response } from "express";
import { json } from "stream/consumers";

export default new (class followService {
  private readonly followRepository: Repository<Following> =
    AppDataSource.getRepository(Following);

  async ngefollow(req: Request, res: Response): Promise<Response> {
    const data = req.body;
    data.follower = res.locals.loginSession.id;
    console.log(data.follower);

    const response = await this.followRepository.findOne({
      where: {
        Following: data.following,
      },
    });

    
      const follow = await this.followRepository.create({
        Follower: data.follower,
        Following: data.following,
      });
      const sayaNgefollow = await this.followRepository.save(follow);
      return res.status(200).json({ message: "follow", sayaNgefollow });
    }
    // const getDataYangDiFollow = await this.followRepository
    //   .createQueryBuilder()
    //   .leftJoinAndSelect("Following.Following", "user")
    //   .where({
    //     Following: data.following,
    //     Follower: res.locals.loginSession.id,
    //   })
    //   .getOne();
    // if (getDataYangDiFollow) {
    //   this.unfollow(getDataYangDiFollow.id);
    // }
    // console.log(`id user login`, data.follower);
    // console.log(`id user yang di follow`, data.following);

    // const sayaNgefollow = await this.followRepository
    //   .createQueryBuilder()
    //   .createQueryBuilder()
    //   .insert()
    //   .into(Following)
    //   .values(data)
    //   .execute();
    // console.log(`sayaNgefollow`, sayaNgefollow);
    

  async unfollow(id: any) {
    const response = await this.followRepository
      .createQueryBuilder()
      .delete()
      .from(Following)
      .where({ id })
      .execute();

    return {
      message: "Success unfollow users",
    };
  }
})();
