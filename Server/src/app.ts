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
import { connectDB } from "./utils/features.js";

import { User } from "./models/user.js";
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

const io = new Server(httpServer, {
  cors: {
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "http://localhost:4173",
      "*",
    ],
    methods: ["GET", "POST"],
    credentials: true,
  },
  path: "/socket.io/",
});

// Express middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors(corsOption));

// Routes
app.use("/api/v1/user", userRoute);
app.use("/api/v1/payment", paymentRoute);
app.use("/api/v1/bet", betRoute);
app.use("/api/v1/dashboard", dashboardRoute);
app.use("/api/v1/upi", upiIdRoute);

// New route to get all bets (active and completed) with their generated numbers
app.get("/api/v1/bets", async (req, res) => {
  try {
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
    res.json(betsWithNumbers);
  } catch (error) {
    res.status(500).json({ message: "Error fetching bets" });
  }
});

// Store active intervals
const activeIntervals: {
  [key: string]: { intervalId: NodeJS.Timeout; stopRequested: boolean };
} = {};

const initializeTable = () => {
  const table = [];
  for (let i = 3; i <= 19; i++) {
    table.push({
      number: i,
      period: 0,
      empty: 0,
      amount: 0,
      status: "inactive",
    });
  }
  return table;
};

let tableData = initializeTable();

const generateRandomNumber = (exclude: number): number => {
  let num: number;
  do {
    num = Math.floor(Math.random() * (19 - 3 + 1)) + 3;
  } while (num === exclude);
  return num;
};

const getIncreasePercentage = (userNum: number): number => {
  if ([7, 8, 14, 15].includes(userNum)) return 0.09;
  if ([5, 6, 16, 17].includes(userNum)) return 0.06;
  if ([9, 10, 12, 13].includes(userNum)) return 0.12;
  if (userNum === 11) return 0.15;
  return 0.03;
};

const getIncreaseTimesProfit = (userNum: number): number => {
  if ([7, 8, 14, 15].includes(userNum)) return 15;
  if ([5, 6, 16, 17].includes(userNum)) return 22.5;
  if ([9, 10, 12, 13].includes(userNum)) return 11.25;
  if (userNum === 11) return 9;
  return 45;
};

const startBetInterval = async (bet: any) => {
  tableData = initializeTable();
  let currentAmount = bet.amount;
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
              period: entry.period + 1,
              empty: 0,
              amount: finalAmount,
            };
          } else {
            return {
              ...entry,
              empty: entry.empty + 1,
            };
          }
        });

        await GeneratedBet.create({
          betId: bet._id,
          betStatus: "inactive",
          generatedNumber: bet.number,
          updatedAmount: finalAmount,
          tableData,
          timestamp: new Date(),
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

        io.emit("betStopped", {
          betId: bet._id,
          betStatus: "inactive",
          lastGeneratedNumber: bet.number,
          finalAmount: finalAmount.toFixed(2),
          profit: finalAmount * getIncreaseTimesProfit(bet.number),
          tableData,
        });
      }
      return;
    }

    const randomNum = generateRandomNumber(bet.number);
    currentAmount *= 1 + increasePercentage;

    tableData = tableData.map((entry) => {
      if (entry.number === randomNum) {
        return {
          ...entry,
          period: entry.period + 1,
          empty: 0,
          amount: currentAmount,
        };
      } else {
        return {
          ...entry,
          empty: entry.empty + 1,
        };
      }
    });

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

    await GeneratedBet.create({
      betId: bet._id,
      betStatus: "active",
      generatedNumber: randomNum,
      updatedAmount: currentAmount,
      tableData,
      timestamp: new Date(),
    });

    io.emit("newGeneratedNumber", {
      betId: bet._id,
      betStatus: "active",
      generatedNumber: randomNum,
      updatedAmount: currentAmount.toFixed(2),
      tableData,
    });
  }, 10 * 1000);

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
        tableData = initializeTable();
        const bet = await Bet.create({ number, amount, status: "active" });
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
      } else {
        socket.emit("error", { message: "No active bet found with this ID" });
      }
    } catch (error) {
      console.error("Error stopping bet:", error);
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
