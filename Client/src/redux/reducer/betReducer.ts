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
  number: 1,
  amount: 0,
  loading: true,
};

export const betReducer = createSlice({
  name: "betReducer",
  initialState,
  reducers: {
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

export const { addBet, clearBet } = betReducer.actions;
