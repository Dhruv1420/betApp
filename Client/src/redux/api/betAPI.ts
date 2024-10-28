import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BetResponse, BetType } from "../../types/apiTypes";

export const betAPI = createApi({
  reducerPath: "betApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/bet/`,
  }),
  tagTypes: ["bets"],
  endpoints: (builder) => ({
    newBet: builder.mutation<BetResponse, BetType>({
      query: (bet) => ({
        url: `new?id=${bet._id}`,
        method: "POST",
        body: bet,
      }),
      invalidatesTags: ["bets"],
    }),
  }),
});

export const { useNewBetMutation } = betAPI;
