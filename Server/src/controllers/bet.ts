import { Request, Response, NextFunction } from "express";
import { TryCatch } from "../middlewares/error.js";
import { Bet } from "../models/bet.js";
import ErrorHandler from "../utils/utility-class.js";
import { GeneratedBet } from "../models/generatedBet.js";
import { ControllerType } from "../types/types.js";
import { User } from "../models/user.js";
import { getIncreaseTimesProfit } from "../app.js";

interface BetRequestBody {
  number: number;
  amount: number;
}

// Store active intervals in memory
const activeIntervals: { [key: string]: NodeJS.Timeout } = {};
const lastGeneratedNumbers: { [key: string]: number } = {};

const generateRandomNumber = (exclude: number): number => {
  let num: number;
  do {
    num = Math.floor(Math.random() * (19 - 3 + 1)) + 3; // Generates a number between 3 and 19
  } while (num === exclude);
  return num;
};

const getIncreasePercentage = (userNum: number): number => {
  if ([7, 8, 14, 15].includes(userNum)) {
    return 0.09; // 9%
  } else if ([5, 6, 16, 17].includes(userNum)) {
    return 0.06; // 6%
  } else if ([9, 10, 12, 13].includes(userNum)) {
    return 0.12; // 12%
  } else if (userNum === 11) {
    return 0.15; // 15%
  } else {
    return 0.03; // 3% for all other numbers
  }
};

const getCurrentTimestamp = (): string => {
  const now = new Date();
  return `${now.toISOString()}`; // Formats timestamp as ISO string
};

export const getNumber = TryCatch(
  async (
    req: Request<{}, {}, BetRequestBody>,
    res: Response,
    next: NextFunction
  ) => {
    const { number, amount: initialAmount } = req.body;

    if (typeof number !== "number" || typeof initialAmount !== "number") {
      return next(
        new ErrorHandler("Please provide both number and amount", 400)
      );
    }

    // Create the bet in the database
    const bet = await Bet.create({ number, amount: initialAmount });

    console.log(
      `Starting with Amount: ${initialAmount}, User Number: ${number}`
    );

    const increasePercentage = getIncreasePercentage(number);
    let amount = initialAmount; // Use let to allow reassigning the amount

    // Array to hold generated data to send back
    const generatedData = [];

    // Store the interval in activeIntervals using the bet ID as the key
    const intervalId = setInterval(async () => {
      const randomNum = generateRandomNumber(number);
      lastGeneratedNumbers[bet._id.toString()] = randomNum; // Store the last generated number

      // Calculate the new amount based on the previous amount
      amount *= 1 + increasePercentage; // Update amount for the next iteration

      // Prepare the generated data for response
      generatedData.push({
        generatedNumber: randomNum,
        updatedAmount: amount.toFixed(2),
      });

      // Save the generated number and updated amount to the database
      await GeneratedBet.create({
        betId: bet._id, // Reference to the original bet
        generatedNumber: randomNum,
        updatedAmount: amount,
        timestamp: new Date(), // Store the actual timestamp
      });

      // Send the response back to the client
      if (res.writable) {
        res.write(
          JSON.stringify({
            success: true,
            generatedNumber: randomNum,
            updatedAmount: amount.toFixed(2),
          }) + "\n"
        );
      }
    }, 10000);

    // Store the interval ID for later use
    activeIntervals[bet._id.toString()] = intervalId;

    // Stop generating numbers after a certain time
    setTimeout(() => {
      clearInterval(intervalId);
      console.log("Stopped generating numbers.");
      // End the response after stopping
      if (res.writable) {
        res.end();
      }
    }, 60000); // Change this duration as needed

    // Initial response with bet details
    return res.status(201).json({
      success: true,
      message: "Bet created successfully",
      bet: {
        id: bet._id,
        number: bet.number,
        amount: bet.amount,
        createdAt: bet.createdAt, // Assuming you have a createdAt field
      },
    });
  }
);

export const stopNumberGeneration: ControllerType<{ betId: string }> = TryCatch(
  async (req, res, next) => {
    const { betId } = req.params; // Correctly get betId from req.params

    const intervalId = activeIntervals[betId];
    if (!intervalId) {
      return next(
        new ErrorHandler("No active generation found for this bet ID", 404)
      );
    }

    // Stop the interval
    clearInterval(intervalId);
    delete activeIntervals[betId];

    // Get the last generated number
    const lastNumber = lastGeneratedNumbers[betId];

    // If there's no last number, respond with an error
    if (lastNumber === undefined) {
      return next(new ErrorHandler("No generated number found to stop", 404));
    }

    // Update the amount one last time using the user-entered number
    const bet = await Bet.findById(betId);
    if (!bet) {
      return next(new ErrorHandler("Bet not found", 404));
    }

    const increasePercentage = getIncreasePercentage(bet.number);
    const finalAmount = bet.amount * (1 + increasePercentage); // Update the amount one last time

    // Update the original bet with the final amount
    bet.amount = finalAmount;
    await bet.save();

    console.log(
      `Stopped generation. Last Generated Number: ${lastNumber}, Final Amount: ${finalAmount.toFixed(
        2
      )}`
    );

    // Optionally save the last number as a generated bet entry
    await GeneratedBet.create({
      betId: bet._id,
      generatedNumber: lastNumber,
      updatedAmount: finalAmount,
      timestamp: new Date(),
    });

    // Clean up the last number tracking
    delete lastGeneratedNumbers[betId];

    return res.status(200).json({
      success: true,
      message: "Number generation stopped successfully",
      lastGeneratedNumber: lastNumber,
      finalAmount,
    });
  }
);

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
  const generatedBets = await GeneratedBet.find().sort({ createdAt: -1 });
  return res.status(200).json({
    success: true,
    message: "Bets Generated Successfully",
    generatedBets,
  });
});
