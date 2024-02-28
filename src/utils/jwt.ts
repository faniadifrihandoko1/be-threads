import { json } from "stream/consumers";
import userType from "../types/userType";
import * as jwt from "jsonwebtoken";

export const generateAccessToken = (user: any): string => {
  return jwt.sign(user, String(process.env.JWT_SECRET), {
    expiresIn:
      process.env.JWT_EXPIRES_IN != null
        ? String(process.env.JWT_EXPIRES_IN)
        : "24h",
  });
};

export const verifyAccessToken = (
  token: string
): string | null | jwt.JwtPayload => {
  try {
    return jwt.verify(token, String(process.env.JWT_SECRET));
  } catch (error) {
    return null;
  }
};

export const decodeAccessToken = (token: string) => {
  return jwt.decode(token, { json: true });
};
