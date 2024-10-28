import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { NewUserRequestBody } from "../types/types.js";
import { BET_APP_TOKEN } from "../constants/keys.js";

export const connectDB = (uri: string) => {
  mongoose
    .connect(uri, {
      dbName: "betApp",
    })
    .then((c) => console.log(`DB connected to ${c.connection.host}`))
    .catch((e) => console.log(e));
};

export const cookieOptions = {
  maxAge: 24 * 60 * 60 * 1000,
  sameSite: "none" as const,
  httpOnly: true,
  secure: true,
};

export const sendToken = (
  res: Response,
  user: NewUserRequestBody,
  code: number,
  message: string
) => {
  const key = BET_APP_TOKEN;
  const JWT_SECRET = process.env.JWT_SECRET || "";
  const token = jwt.sign({ email: user.email }, JWT_SECRET);

  return res.status(code).cookie(key, token, cookieOptions).json({
    success: true,
    message,
    user,
  });
};
