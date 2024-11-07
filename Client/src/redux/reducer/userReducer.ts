import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { UserReducerInitialState } from "../../types/reducerTypes";
import { updateUserReal, User } from "../../types/types";

const initialState: UserReducerInitialState = {
  user: null,
  loading: true,
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<User>) => {
      state.loading = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loading = false;
      state.user = null;
    },
    updateUser: (state, action: PayloadAction<updateUserReal>) => {
      state.loading = false;
      if (state.user) {
        if (action.payload.coins) {
          state.user.coins = action.payload.coins;
        }
        state.user.status = action.payload.status;
      }
    },
  },
});

export const { userExist, userNotExist, updateUser } = userReducer.actions;
