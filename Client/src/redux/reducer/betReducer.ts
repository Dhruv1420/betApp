import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { betReducerInitialState } from "../../types/reducerTypes";
import { Bet } from "../../types/types";

const initialState: betReducerInitialState = {
  bet: [
    {
      time: new Date().toISOString(),
      number: 1,
      amount: 0,
    },
  ],
  betStart: false,
  number: 1,
  amount: 0,
  loading: true,
};

export const betReducer = createSlice({
  name: "betReducer",
  initialState,
  reducers: {
    betOpen: (state) => {
      state.loading = false;
      state.betStart = true;
    },
    betClose: (state) => {
      state.loading = false;
      state.betStart = false;
    },
    addBet: (state, action: PayloadAction<Bet>) => {
      state.loading = false;
      state.bet.push(action.payload);
    },
    clearBet: (state) => {
      state.loading = false;
      state.bet = initialState.bet;
    },
  },
});

export const { addBet, clearBet, betOpen, betClose } = betReducer.actions;
