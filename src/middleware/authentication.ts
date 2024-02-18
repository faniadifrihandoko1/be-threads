import { NextFunction, Request, Response } from "express";
import { decodeAccessToken, verifyAccessToken } from "../utils/jwt";

export const authentication = (
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Token tidak ditemukan atau tidak valid",
    });
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({
      error: "unauthorized",
      message: "Token tidak ditemukan atau tidak valid",
    });
  }

  const user = verifyAccessToken(token);
  res.locals.loginSession = user;
  // console.log("res local auth", res.locals.loginSession);
  if (!user) {
    return res
      .status(401)
      .json({ error: "unauthorized", message: "Token tidak valid" });
  }

  next();
};
