import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { compare, encript } from "../utils/bcrypt";
import userType from "../types/userType";
import { generateAccessToken } from "../utils/jwt";
import { Request, Response } from "express";
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation";
import * as bcrypt from "bcrypt";
import { get } from "http";

export default new (class AuthService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const { error, value } = registerValidation(req.body);
      if (error != null) {
        return res.status(400).json({
          message: error.details[0].message,
        });
      }

      const getUsername = await this.userRepository
        .createQueryBuilder("user")
        .where({ username: value.username })
        .getCount();

      const getEmail = await this.userRepository
        .createQueryBuilder("user")
        .where({ email: value.email })
        .getCount();

      if (getEmail > 0) {
        return res.status(400).json({
          message: "Email sudah terdaftar, gunakan email lain",
        });
      } else if (getUsername > 0) {
        return res.status(400).json({
          message: "Username sudah terdaftar, gunakan username lain",
        });
      }

      value.password = encript(value.password);

      const response = await this.userRepository
        .createQueryBuilder()
        .insert()
        .into(User)
        .values(value)
        .execute();
      console.log(`response :`, response);
      return res.status(200).json({
        message: "Register Berhasil",
        data: value,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { error, value } = loginValidation(req.body);
    const getData = await this.userRepository
      .createQueryBuilder("user")
      .where({ email: value.email })
      .leftJoinAndSelect("user.following", "following")
      .leftJoinAndSelect("user.follower", "follower")
      .getOne();

    if (error != null) {
      return res.status(400).json({
        message: "input data gagal",
      });
    }

    if (!getData) {
      return res.status(400).json({
        message: "Email tidak terdaftar",
      });
    }
    const comparePassword = await bcrypt.compare(
      value.password,
      getData.password
    );
    if (!comparePassword) {
      return res.status(400).json({
        message: "Password salah",
      });
    }

    const obj = {
      id: getData.id,
      email: getData.email,
      username: getData.username,
      fullName: getData.fullName,
      photo_profile: getData.photo_profile,
      photo_cover: getData.photo_cover,
      bio: getData.bio,
      following: getData.following,
      follower: getData.follower,
    };

    const token = generateAccessToken(obj);
    return res.status(200).json({
      message: "Login Berhasil",
      token,
    });
  }
})();
