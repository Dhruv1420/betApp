import { NextFunction, Request, Response } from "express";
import { BET_APP_TOKEN } from "../constants/keys.js";
import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import { AuthRequest, NewUserRequestBody } from "../types/types.js";
import { cookieOptions, sendToken } from "../utils/features.js";
import ErrorHandler from "../utils/utility-class.js";

export const register = TryCatch(
  async (
    req: Request<{}, {}, NewUserRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { name, email, password, gender, referalCode, phone } = req.body;

    let user = await User.findOne({ email });
    if (user) return next(new ErrorHandler("Email already registered", 400));

    if (!name || !email || !password || !gender || !phone)
      return next(new ErrorHandler("Please enter all fields", 400));

    user = await User.create({
      name,
      email,
      password,
      gender,
      referalCode,
      phone,
    });

    sendToken(res, user, 201, `Welcome, ${user.name}`);
  }
);

export const login = TryCatch(async (req, res, next) => {
  const { email, password } = req.body;
  let user = await User.findOne({ email }).select("+password");
  if (!user) return next(new ErrorHandler("Invalid Email or Password", 404));

  const isMatch = password === user.password;
  if (!isMatch) return next(new ErrorHandler("Invalid Email or Password", 404));

  sendToken(res, user, 200, `Welcome Back, ${user.name}`);
});

export const getMyProfile = TryCatch(async (req: AuthRequest, res, next) => {
  const user = await User.findById(req.user);

  if (!user) return next(new ErrorHandler("User Not Found", 404));

  res.status(200).json({
    success: true,
    user,
  });
});

export const logout = TryCatch(async (req, res) => {
  return res
    .status(200)
    .cookie(BET_APP_TOKEN, "", { ...cookieOptions, maxAge: 0 })
    .json({
      success: true,
      message: "Logged out Successfully",
    });
});

export const getAllUsers = TryCatch(async (req, res, next) => {
  const users = await User.find().select("+password");

  return res.status(200).json({
    success: true,
    users,
  });
});

export const getActiveUsers = TryCatch(async (req, res, next) => {
  const activeUserCounts = await User.countDocuments({ status: "active" });

  return res.status(200).json({
    success: true,
    message: "Active Users",
    activeUserCounts,
  });
});

export const getUser = TryCatch(async (req: AuthRequest, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid ID", 400));

  // if (id !== req.user) return next(new ErrorHandler("Not authorized", 400));

  return res.status(200).json({
    success: true,
    user,
  });
});

export const updateUser = TryCatch(async (req: AuthRequest, res, next) => {
  const id = req.params.id;
  let user = await User.findById(id);

  if (!user || req.user !== id)
    return next(new ErrorHandler("Invalid ID", 400));

  const { name } = req.body;
  if (!name) return next(new ErrorHandler("Please enter name", 400));

  user.name = name;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Username updated successfully",
    user,
  });
});

export const deleteUser = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const user = await User.findById(id);

  if (!user) return next(new ErrorHandler("Invalid ID", 400));
  if (user.role === "admin")
    return next(
      new ErrorHandler("You are not allowed to delete this user", 400)
    );

  await user.deleteOne();

  return res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});
