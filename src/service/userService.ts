import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { Request, Response } from "express";
import cloudinary from "../lib/cloudinary";
import { redisClient } from "../lib/redis";

export default new (class userService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async getUserById(req: Request, res: Response): Promise<Response> {
    try {
      const username = String(req.params.username);
      const response = await this.userRepository
        .createQueryBuilder("user")
        .leftJoinAndSelect("user.following", "following")
        .leftJoinAndSelect("user.follower", "follower")
        .where({ username: username })
        .getOne();
      return res.status(200).json({
        message: "success",
        data: {
          id: response.id,
          fullName: response.fullName,
          email: response.email,
          photo_profile: response.photo_profile,
          photo_cover: response.photo_cover,
          bio: response.bio,
          username: response.username,
          following: response.following.length,
          follower: response.follower.length,
        },
      });
    } catch (error) {
      return res.status(500).json({ message: error.message });
    }
  }

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

      return res.status(200).json({ message: "update success", data: user });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async updateCover(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const userId = res.locals.loginSession.id;
      const cover = req.file.filename;

      if (userId != id) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      if (!cover) {
        return res.status(400).json({ message: "Cover not found" });
      }

      const userLogin = await this.userRepository.findOne({
        where: {
          id,
        },
      });

      if (userLogin.photo_cover == cover) {
        return res.status(400).json({ message: "You dont change cover" });
      } else {
        cloudinary.config();
        const cloud = await cloudinary.destination(cover);

        await this.userRepository
          .createQueryBuilder()
          .update(User)
          .set({ photo_cover: cloud })
          .where({ id })
          .execute();

        return res.status(200).json({ message: "update cover success" });
      }

      const obj = await this.userRepository.findOne({
        where: {
          id,
        },
      });
      const data = req.body;
      const user = await this.userRepository.save(obj);
      return res.status(200).json({ message: "update success", data: user });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async getCurrent(req: Request, res: Response): Promise<Response> {
    try {
      let data = await redisClient.get(`user:${res.locals.loginSession.id}`);
      console.log(data);
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
        photo_cover: response.photo_cover,
        bio: response.bio,
        username: response.username,
        following: response.following.length,
        follower: response.follower.length,
      },
    });
  }
})();
