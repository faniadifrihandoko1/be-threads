import { json } from "stream/consumers";
import userType from "../types/userType";
import * as jwt from "jsonwebtoken";

export const generateAccessToken = (user: any): string => {
  return jwt.sign(user, String(process.env.JWT_SECRET), {
    expiresIn:
      process.env.JWT_EXPIRES_IN != null
        ? String(process.env.JWT_EXPIRES_IN)
        : "1800s",
  });
};
