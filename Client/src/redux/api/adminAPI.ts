import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { addCoinsResponse, addCoinsType } from "../../types/apiTypes";

export const adminAPI = createApi({
  reducerPath: "adminApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/dashboard/`,
  }),
  tagTypes: ["admin"],
  endpoints: (builder) => ({
    addCoins: builder.mutation<addCoinsResponse, addCoinsType>({
      query: ({ userId, coins }) => ({
        url: `addcoins/${userId}`,
        method: "POST",
        body: { coins },
        credentials: "include",
      }),
      invalidatesTags: ["admin"],
    }),
  }),
});

export const { useAddCoinsMutation } = adminAPI;
