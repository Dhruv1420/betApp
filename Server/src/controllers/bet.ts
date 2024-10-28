import { TryCatch } from "../middlewares/error.js";
import { Bet } from "../models/bet.js";
import ErrorHandler from "../utils/utility-class.js";

export const getNumber = TryCatch(async (req, res, next) => {
  const { number, amount } = req.body;
  if (!number || !amount)
    return next(new ErrorHandler("Please provide both number and amount", 400));

  await Bet.create({ number, amount });

  return res.status(201).json({
    success: true,
    message: "Bet created successfully",
    number,
    amount,
  });
});
