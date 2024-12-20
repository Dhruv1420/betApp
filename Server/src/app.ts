import cookieParser from "cookie-parser";
import cors from "cors";
import { config } from "dotenv";
import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { corsOption } from "./constants/config.js";
import { errorMiddleware } from "./middlewares/error.js";
import { Bet } from "./models/bet.js";
import { GeneratedBet } from "./models/generatedBet.js";
import { User } from "./models/user.js";
import {
  calculateRemainingTime,
  connectDB,
  generateLotteryNumber,
  generateRandomNumber,
  getIncreasePercentage,
  getIncreaseTimesProfit,
  processManualBets,
} from "./utils/features.js";

import betRoute from "./routes/bet.js";
import paymentRoute from "./routes/payment.js";
import dashboardRoute from "./routes/stats.js";
import upiIdRoute from "./routes/upiId.js";
import userRoute from "./routes/user.js";

config({
  path: "./.env",
});

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";

connectDB(MONGO_URI);

const app = express();
const httpServer = createServer(app);

export const io = new Server(httpServer, {
  cors: {
    // origin: [
    //   "http://localhost:5173",
    //   "http://localhost:3000",
    //   "http://localhost:4173",
    //   "*",
    // ],
    origin: true,
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
});

// Express middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

app.get("/", (req, res) => {
  res.send("Server is running");
});

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/bet", betRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/upi", upiIdRoute);

// Store active intervals
const activeIntervals: {
  [key: string]: { intervalId: NodeJS.Timeout; stopRequested: boolean };
} = {};

const initializeTable = () => {
  const table = [];
  for (let i = 3; i <= 19; i++) {
    table.push({
      number: i,
      period: 21458627,
      empty: 0,
      amount: 0,
      status: "inactive",
    });
  }
  return table;
};

let tableData = initializeTable();
let isAdminControlled = false;
let periodCounter = 21458627;
let betTime = 10;

const startContinuousInterval = () => {
  let currentAmount = 0;
  let activeBetId: string | null = null;

  const intervalId = setInterval(async () => {
    if (activeBetId && activeIntervals[activeBetId]?.stopRequested) {
      activeIntervals[activeBetId].stopRequested = false;
      currentAmount = 0;
      activeBetId = null;
    }

    periodCounter++;
    const randomNum = generateRandomNumber(1);
    const lotteryNumber = generateLotteryNumber(randomNum);

    tableData = tableData.map((entry) => {
      if (entry.number === randomNum) {
        return {
          ...entry,
          period: periodCounter,
          empty: 0,
          amount: 0,
        };
      } else {
        return {
          ...entry,
          empty: entry.empty + 1,
          amount: 0,
        };
      }
    });

    await processManualBets(randomNum);

    io.emit("newGeneratedNumber", {
      betStatus: isAdminControlled ? "active" : "inactive",
      adminNumber: "-",
      generatedNumber: randomNum,
      updatedAmount: currentAmount.toFixed(2),
      lotteryNumber,
      tableData,
    });

    if (!activeBetId) {
      await GeneratedBet.create({
        betStatus: "inactive",
        generatedNumber: randomNum,
        updatedAmount: currentAmount,
        lotteryNumber,
        tableData,
        timestamp: new Date(),
      });
    }
  }, betTime * 1000);

  return intervalId;
};

let continuousIntervalId = startContinuousInterval();

const startBetInterval = async (bet: any) => {
  let currentAmount = isAdminControlled ? bet.amount : 0;
  const increasePercentage = getIncreasePercentage(bet.number);

  const intervalId = setInterval(async () => {
    if (activeIntervals[bet._id.toString()]?.stopRequested) {
      clearInterval(intervalId);
      delete activeIntervals[bet._id.toString()];

      const lastGeneratedBet = await GeneratedBet.findOne({
        betId: bet._id,
      }).sort({
        timestamp: -1,
      });

      if (lastGeneratedBet) {
        const finalAmount =
          lastGeneratedBet.updatedAmount * (1 + increasePercentage);

        tableData = tableData.map((entry) => {
          if (entry.number === bet.number) {
            return {
              ...entry,
              period: periodCounter,
              empty: 0,
              amount: finalAmount,
            };
          } else {
            return {
              ...entry,
              empty: entry.empty + 1,
              amount: 0,
            };
          }
        });

        await Bet.findByIdAndUpdate(bet._id, {
          amount: finalAmount,
          status: "completed",
        });

        const users = await User.find({ status: "active" });
        users.forEach(async (user) => {
          user.coins += finalAmount * getIncreaseTimesProfit(bet.number);
          user.status = "inactive";
          await user.save();
        });

        const userIds = users.map((user) => user._id);
        const lotteryNumber = generateLotteryNumber(bet.number);

        await processManualBets(bet.number);

        await GeneratedBet.create({
          betId: bet._id,
          betStatus: "inactive",
          generatedNumber: bet.number,
          updatedAmount: finalAmount,
          profit: finalAmount * getIncreaseTimesProfit(bet.number),
          userIds,
          lotteryNumber,
          tableData,
          timestamp: new Date(),
        });

        io.emit("betStopped", {
          betId: bet._id,
          betStatus: "inactive",
          lastGeneratedNumber: bet.number,
          finalAmount: finalAmount.toFixed(2),
          userIds,
          lotteryNumber,
          profit: finalAmount * getIncreaseTimesProfit(bet.number),
          tableData,
        });
      }

      isAdminControlled = false;
      return;
    }

    const randomNum = isAdminControlled
      ? generateRandomNumber(bet.number)
      : generateRandomNumber(1);

    if (isAdminControlled) {
      currentAmount *= 1 + increasePercentage;
    } else {
      currentAmount = 0;
    }

    tableData = tableData.map((entry) => {
      if (entry.number === randomNum) {
        return {
          ...entry,
          period: periodCounter,
          empty: 0,
        };
      } else if (entry.number === bet.number) {
        return {
          ...entry,
          amount: currentAmount,
          empty: entry.empty + 1,
        };
      } else {
        return {
          ...entry,
          empty: entry.empty + 1,
        };
      }
    });

    const lotteryNumber = generateLotteryNumber(randomNum);

    const users = await User.find({ status: "active" });
    users.forEach(async (user) => {
      if (user.coins < currentAmount) {
        io.emit("error", { message: "Insufficient coins available" });
        user.status = "inactive";
      } else {
        user.coins -= currentAmount;
      }
      await user.save();
    });

    await processManualBets(randomNum);

    await GeneratedBet.create({
      betId: bet._id,
      betStatus: isAdminControlled ? "active" : "inactive",
      generatedNumber: randomNum,
      updatedAmount: currentAmount,
      lotteryNumber,
      tableData,
      timestamp: new Date(),
    });

    io.emit("newGeneratedNumber", {
      betId: bet._id,
      adminNumber: bet.number,
      betStatus: isAdminControlled ? "active" : "inactive",
      generatedNumber: randomNum,
      updatedAmount: currentAmount.toFixed(2),
      lotteryNumber,
      tableData,
    });
  }, betTime * 1000);

  activeIntervals[bet._id.toString()] = { intervalId, stopRequested: false };
};

// Check for any active bets on server start and restart their intervals
const initializeActiveBets = async () => {
  const activeBets = await Bet.find({ status: "active" });
  for (const bet of activeBets) {
    startBetInterval(bet);
  }
};

initializeActiveBets();

io.on("connection", (socket: Socket) => {
  console.log("Client connected:", socket.id);

  socket.on("startBet", async ({ number, amount }) => {
    try {
      if (number < 3 || number > 19)
        socket.emit("error", { message: "Number should in between 3 and 19" });
      else if (amount <= 0)
        socket.emit("error", { message: "Amount should be poitive" });
      else {
        clearInterval(continuousIntervalId);

        // tableData = initializeTable();
        const bet = await Bet.create({ number, amount, status: "active" });
        isAdminControlled = true;

        startBetInterval(bet);

        io.emit("betStarted", {
          betId: bet._id,
          betStatus: "active",
          message: "Bet started successfully",
        });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to start bet" });
    }
  });

  socket.on("activeUser", async ({ userId }) => {
    try {
      await User.findByIdAndUpdate(userId, { status: "active" });
      socket.emit("userActivated", { message: "You are now active" });
    } catch (error) {
      socket.emit("error", { message: "Failed to update user status" });
    }
  });

  socket.on("inactiveUser", async ({ userId }) => {
    try {
      await User.findByIdAndUpdate(userId, { status: "inactive" });
      socket.emit("userInactive", { message: "You are now inactive" });
    } catch (error) {
      socket.emit("error", { message: "Failed to update user status" });
    }
  });

  socket.on("stopBet", async ({ betId }) => {
    try {
      const intervalId = activeIntervals[betId];
      if (intervalId) {
        activeIntervals[betId].stopRequested = true;

        socket.emit("betStopScheduled", {
          betId,
          message: "Bet stop scheduled for next cycle",
        });

        const stoppingTime = await GeneratedBet.findOne().sort({
          timestamp: -1,
        });
        if (stoppingTime) {
          const remainingTime = calculateRemainingTime(
            betTime,
            stoppingTime?.timestamp.toString()
          );
          setTimeout(() => {
            clearInterval(continuousIntervalId);
            continuousIntervalId = startContinuousInterval();
          }, remainingTime * 1000);
        }
      } else {
        socket.emit("error", { message: "No active bet found with this ID" });
      }
    } catch (error) {
      socket.emit("error", { message: "Failed to stop bet" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected:", socket.id);
  });
});

app.use(errorMiddleware);

httpServer.listen(PORT, () => {
  console.log(`Server is working on port ${PORT}`);
});
