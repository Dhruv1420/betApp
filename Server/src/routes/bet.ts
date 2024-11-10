import express from "express";
import {
  getBets,
  getNumber,
  getResults,
  getWagerDetails,
  manualBetting,
  stopNumberGeneration,
  tableData,
} from "../controllers/bet.js";
import { adminOnly } from "../middlewares/auth.js";

const app = express.Router();

app.post("/new", adminOnly, getNumber);
app.post("/stopbet/:betId", stopNumberGeneration);
app.get("/victory", tableData);
app.post("/manualbet", manualBetting);
app.get("/wagerdetails", getWagerDetails);
app.get("/bets", getBets);
app.get("/results", getResults);

export default app;
