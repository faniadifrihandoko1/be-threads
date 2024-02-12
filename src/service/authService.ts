import { Repository } from "typeorm";
import { User } from "../entities/User";
import { AppDataSource } from "../data-source";
import { compare, encript } from "../utils/bcrypt";
import userType from "../types/userType";
import { generateAccessToken } from "../utils/jwt";
import { Request, Response } from "express";
import { loginValidation, registerValidation } from "../validations/authValidation";

export default new (class AuthService {
  private readonly userRepository: Repository<User> =
    AppDataSource.getRepository(User);

  async register(req: Request, res: Response): Promise<Response> {
    try {
      const data = req.body;
      const getData = await this.userRepository
        .createQueryBuilder()
        .where({ email: data.email, fullName: data.fullName })
        .getCount();

      if (getData > 0) {
        return res.status(400).json({
          message: "Email or username already exist",
        });
      }

      const { error, value } = registerValidation(req.body);
      if (error != null) {
        return res.status(400).json({
          error: error.details[0].message,
          message: "input data gagal",
        });
      }
      value.password = encript(value.password);
      return res.status(200).json({
        message: "Register success",
        data: value,
      });
    } catch (error) {
      return res.status(500).json(error);
    }
  }

  async login(req: Request, res: Response): Promise<Response> {
    const { error, value } = loginValidation(req.body);
    const getData = await this.userRepository
      .createQueryBuilder()
      .where({ email: value.email })
      .getOne();
    if (error != null) {
      return res.status(400).json({
        error: error.details[0].message,
        message: "input data gagal",
        data: value,
      });
    }

    if (value === null) {
      return res.status(400).json({
        message: "Email not found",
      });
    }

    if (!compare(value.password, getData.password)) {
      return res.status(400).json({
        message: "Wrong password",
      });
    }

    const token = generateAccessToken({ value });
    return res.status(200).json({
      message: "Login success",
      token,
    });
  }
})();
