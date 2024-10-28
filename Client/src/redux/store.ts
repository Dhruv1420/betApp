import { configureStore } from "@reduxjs/toolkit";
import { userReducer } from "./reducer/userReducer";
import { paymentReducer } from "./reducer/paymentReducer";
import { userAPI } from "./api/userAPI";
import { paymentAPI } from "./api/paymnetAPI";
export const server = import.meta.env.VITE_SERVER;

export const store = configureStore({
  reducer: {
    [userAPI.reducerPath]: userAPI.reducer,
    [userReducer.name]: userReducer.reducer,
    payment: paymentReducer,
    [paymentAPI.reducerPath]: paymentAPI.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(userAPI.middleware, paymentAPI.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
