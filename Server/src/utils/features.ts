import { Response } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { BET_APP_TOKEN, sumPairs } from "../constants/keys.js";
import { ManualBet } from "../models/manualBet.js";
import { User } from "../models/user.js";
import { NewUserRequestBody } from "../types/types.js";
import { io } from "../app.js";

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

export const generateRandomNumber = (exclude: number): number => {
  let num: number;
  do {
    num = Math.floor(Math.random() * (19 - 3 + 1)) + 3;
  } while (num === exclude);
  return num;
};

export const getIncreasePercentage = (userNum: number): number => {
  if ([7, 8, 14, 15].includes(userNum)) return 0.09;
  if ([5, 6, 16, 17].includes(userNum)) return 0.06;
  if ([9, 10, 12, 13].includes(userNum)) return 0.12;
  if (userNum === 11) return 0.15;
  return 0.03;
};

export const getIncreaseTimesProfit = (userNum: number): number => {
  if ([7, 8, 14, 15].includes(userNum)) return 15;
  if ([5, 6, 16, 17].includes(userNum)) return 22.5;
  if ([9, 10, 12, 13].includes(userNum)) return 11.25;
  if (userNum === 11) return 9;
  return 45;
};

export const generateLotteryNumber = (generatedNumber: number): number[] => {
  const pairs = sumPairs[generatedNumber];
  let [firstNum, secondNum] = pairs[Math.floor(Math.random() * pairs.length)];

  if (Math.random() > 0.5) {
    [firstNum, secondNum] = [secondNum, firstNum];
  }

  const lotteryNumber = [firstNum, secondNum];

  for (let i = 0; i < 8; i++) {
    const randomNum = Math.floor(Math.random() * 10) + 1;
    lotteryNumber.push(randomNum);
  }

  return lotteryNumber;
};

export const processManualBets = async (randomNum: number) => {
  const manualbets = await ManualBet.find({ status: "pending" });
  await Promise.all(
    manualbets.map(async (entry) => {
      try {
        const increaseAmount =
          entry.amount * getIncreaseTimesProfit(entry.number);
        const user = await User.findById(entry.userId);

        if (user) {
          if (entry.number === randomNum) {
            user.coins += increaseAmount;
            entry.profit = increaseAmount;
          } else {
            user.coins = Math.max(0, user.coins - entry.amount);
            entry.profit = -entry.amount;
          }
          await user.save();
          io.to(user._id.toString()).emit("coinsUpdated", user.coins);
        }

        entry.status = "completed";
        await entry.save();
      } catch (error) {
        console.error(`Error processing bet for user ${entry.userId}:`, error);
      }
    })
  );
};

export const calculateRemainingTime = (
  betTime: number,
  stoppingTimestamp: string
) => {
  const currentTime = Date.now();
  const stoppingTime = new Date(stoppingTimestamp).getTime();
  const elapsedSeconds = (currentTime - stoppingTime) / 1000;
  return Math.max(betTime - elapsedSeconds, 0);
};
