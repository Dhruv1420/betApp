import { TryCatch } from "../middlewares/error.js";
import { User } from "../models/user.js";
import ErrorHandler from "../utils/utility-class.js";

export const addCoins = TryCatch(async (req, res, next) => {
  const id = req.params.id;
  const { coins } = req.body;

  if (!coins) return next(new ErrorHandler("Please enter coins", 400));
  const user = await User.findById(id);
  if (!user) return next(new ErrorHandler("Invalid ID", 400));

  user.coins += coins;
  await user.save();

  return res.status(200).json({
    success: true,
    message: "Coins added successfully",
    user,
  });
});
