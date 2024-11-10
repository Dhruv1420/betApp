import { getIncreaseTimesProfit } from "../app.js";
import { TryCatch } from "../middlewares/error.js";
import { Bet } from "../models/bet.js";
import { GeneratedBet } from "../models/generatedBet.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

export const tableData = TryCatch(async (req, res, next) => {
  const data = await GeneratedBet.findOne().sort({ timestamp: -1 });

  if (!data) {
    return next(new ErrorHandler("No table data found", 404));
  }

  return res.status(200).json({
    success: true,
    data: data.tableData,
    betStatus: data.betStatus,
  });
});

export const manualBetting = TryCatch(async (req, res, next) => {
  const { id, amount, number } = req.body;
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("User not found", 404));

  if (!amount || !number)
    return next(new ErrorHandler("Please enter all fields", 400));
  if (number < 3 || number > 19)
    return next(new ErrorHandler("Number must be between 3 and 19", 400));
  if (amount <= 0)
    return next(new ErrorHandler("Please enter valid amount", 400));
  if (amount > user.coins)
    return next(new ErrorHandler("Insufficient coins", 400));

  const randomNumber = Math.floor(Math.random() * (19 - 3 + 1)) + 3;
  let profit = 0;
  if (randomNumber != number) {
    user.coins -= amount;
  } else {
    const prod = getIncreaseTimesProfit(number);
    user.coins += amount * prod;
    profit = amount * prod;
  }
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Bet successful",
    profit,
    randomNumber,
  });
});

export const getWagerDetails = TryCatch(async (req, res, next) => {
  const generatedBets = await GeneratedBet.find().sort({ timestamp: -1 });

  const results = generatedBets.map((bet) => {
    return {
      amount: bet.updatedAmount.toFixed(2),
      number: bet.generatedNumber,
      status: bet.profit > 0 ? "Win" : "Loss",
      profit: bet.profit,
      lotteryNumbers: bet.lotteryNumber,
      time: bet.timestamp,
    };
  });

  return res.status(200).json(results);
});

export const getBets = TryCatch(async (req, res, next) => {
  const bets = await Bet.find().sort({ createdAt: -1 }).limit(10);
  const betsWithNumbers = await Promise.all(
    bets.map(async (bet) => {
      const generatedNumbers = await GeneratedBet.find({
        betId: bet._id,
      }).sort({ timestamp: 1 });
      return {
        ...bet.toObject(),
        generatedNumbers: generatedNumbers,
      };
    })
  );

  return res.status(200).json(betsWithNumbers);
});

export const getResults = TryCatch(async (req, res, next) => {
  const bets = await GeneratedBet.find().sort({ timestamp: -1 });
  const results = bets.map((bet) => {
    return {
      number: bet.generatedNumber,
      amount: bet.updatedAmount.toFixed(2),
      time: bet.timestamp,
    };
  });

  return res.status(200).json(results);
});
