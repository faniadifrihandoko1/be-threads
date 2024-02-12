import { Request, Response } from "express";
import authService from "../service/authService";
import * as bcrypt from "bcrypt";
import {
  loginValidation,
  registerValidation,
} from "../validations/authValidation";
import { compare, encript } from "../utils/bcrypt";
import { generateAccessToken } from "../utils/jwt";

export default new (class AuthController {
  register(req: Request, res: Response) {
    authService.register(req, res);
  }

  login(req: Request, res: Response) {
    authService.login(req, res);
  }
})();
