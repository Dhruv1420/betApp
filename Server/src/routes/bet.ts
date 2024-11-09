import express from "express";
import {
  getNumber,
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
app.get("/wagerdeatils", getWagerDetails);

export default app;
