import express from "express";
import {
  getBets,
  getManualBets,
  getResults,
  getWagerDetails,
  manualBetting,
  tableData,
} from "../controllers/bet.js";

const app = express.Router();

app.get("/victory", tableData);
app.post("/manualbet", manualBetting);
app.get("/wagerdetails", getWagerDetails);
app.get("/bets", getBets);
app.get("/results", getResults);
app.get("/getmanualbets", getManualBets);

export default app;
