import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";

export default new (class userService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async update(req: Request, res: Response): Promise<Response> {
    try {
      const id = parseInt(req.params.id);

      const obj = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      const data = req.body;

      let img = null;
      if (req.file) {
        data.photo_profile = res.locals.filename;
        const cloud = await cloudinary.destination(data.photo_profile);
        console.log(cloud);
        data.photo_profile = cloud;
      } else {
        data.photo_profile = img;
      }
      console.log(data);

      if (data.fullName != null) {
        obj.fullName = data.fullName;
      }

      if (data.username != null) {
        obj.username = data.username;
      }

      if (data.email != null) {
        obj.email = data.email;
      }

      if (data.password != null) {
        obj.password = data.password;
      }

      if (data.photo_profile != null) {
        obj.photo_profile = data.photo_profile;
      }
      if (data.bio != null) {
        obj.bio = data.bio;
      }

      if (data.following != null) {
        obj.following = data.following;
      }

      if (data.follower != null) {
        obj.follower = data.follower;
      }

      const user = await this.userRepository.save(obj);

      // let img = null;
      // if (req.file) {
      //   data.image = res.locals.filename;
      //   const cloud = await cloudinary.destination(data.image);
      //   data.image = cloud;
      // } else {
      //   data.image = img;
      // }

      // const response = await this.userRepository
      //   .createQueryBuilder()
      //   .update(User)
      //   .set(data)
      //   .where({ id })
      //   .execute();

      return res.status(200).json({ message: "update success", data: user });
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

      return res.status(200).json({ message: "success", data: getData });
    } catch (error) {
      res.status(500).json(error);
    }
  }

  async check(req: Request, res: Response): Promise<Response> {
    const userLogin = res.locals.loginSession.id;
    const response = await this.userRepository
      .createQueryBuilder()
      .where({
        id: userLogin,
      })
      .leftJoinAndSelect("User.following", "following")
      .leftJoinAndSelect("User.follower", "follower")
      .getOne();

    return res.status(200).json({
      message: "success",
      data: {
        id: response.id,
        fullName: response.fullName,
        email: response.email,
        photo_profile: response.photo_profile,
        bio: response.bio,
        username: response.username,
        following: response.following.length,
        follower: response.follower.length,
      },
    });
  }
})();
