import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { upiType, upiTypeResponse } from "../../types/apiTypes";

export const upiAPI = createApi({
  reducerPath: "upiAPI",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/upi/`,
  }),
  tagTypes: ["upi"],
  endpoints: (builder) => ({
    addUpi: builder.mutation<upiTypeResponse, upiType>({
      query: ({ upiId, _id }) => ({
        url: `upi?id=${_id}`,
        method: "POST",
        body: { upiId },
        credentials: "include",
      }),
      invalidatesTags: ["upi"],
    }),
    getUpi: builder.query<upiTypeResponse, string>({
      query: (id) => ({
        url: `upi?id=${id}`,
        credentials: "include",
      }),
      providesTags: ["upi"],
    }),
    dltUpi: builder.mutation<upiTypeResponse, upiType>({
      query: ({ upiId, _id }) => ({
        url: `upi?id=${_id}`,
        method: "DELETE",
        body: { upiId },
        credentials: "include",
      }),
      invalidatesTags: ["upi"],
    }),
  }),
});

export const { useAddUpiMutation, useDltUpiMutation, useGetUpiQuery } = upiAPI;
