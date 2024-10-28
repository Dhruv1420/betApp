import { User } from "../models/user.js";
import jwt from "jsonwebtoken";
import { AuthRequest } from "../types/types.js";
import ErrorHandler from "../utils/utility-class.js";
import { TryCatch } from "./error.js";
import { BET_APP_TOKEN } from "../constants/keys.js";

export const isAuthenticated = TryCatch(async (req: AuthRequest, res, next) => {
  const token = req.cookies[BET_APP_TOKEN];
  if (!token)
    return next(new ErrorHandler("Not authorized, token missing", 401));

  const JWT_SECRET = process.env.JWT_SECRET || "";
  const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
  const user = await User.findOne({ email: decoded.email });

  if (!user)
    return next(new ErrorHandler("Not authorized, user not found", 404));

  req.user = user.id;

  next();
});

export const adminOnly = TryCatch(async (req, res, next) => {
  const { id } = req.query;
  if (!id) return next(new ErrorHandler("Login First!", 401));

  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User Not Found", 404));

  if (user.role !== "admin")
    return next(new ErrorHandler("Unauthorized Access", 403));

  next();
});
