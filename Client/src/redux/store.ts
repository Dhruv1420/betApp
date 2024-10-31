import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/userReducer";
import { userAPI } from "./api/userAPI";
import { paymentAPI } from "./api/paymnetAPI";
import { betReducer } from "./reducer/betReducer";
import { betAPI } from "./api/betAPI";
import { adminAPI } from "./api/adminAPI";
import { upiAPI } from "./api/upiAPI";

export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userReducer.name]: userReducer.reducer,
    [betReducer.name]: betReducer.reducer,
    [userAPI.reducerPath]: userAPI.reducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
    [betAPI.reducerPath]: betAPI.reducer,
    [adminAPI.reducerPath]: adminAPI.reducer,
    [upiAPI.reducerPath]: upiAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
      userAPI.middleware,
      paymentAPI.middleware,
      betAPI.middleware,
      adminAPI.middleware,
      upiAPI.middleware,
    ),
});

export type RootState = ReturnType<typeof store.getState>;
