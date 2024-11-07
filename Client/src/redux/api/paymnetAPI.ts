import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  PaymentDetailsRequest,
  PaymentResponse,
  WithdrawRequest,
} from "../../types/apiTypes";

export const paymentAPI = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`,
  }),
  tagTypes: ["payment"],
  endpoints: (builder) => ({
    createPaymentIntent: builder.mutation<PaymentResponse, { amount: number }>({
      query: (paymentData) => ({
        url: "create",
        method: "POST",
        body: paymentData,
      }),
      invalidatesTags: ["payment"],
    }),
    paymentDetails: builder.mutation<PaymentResponse, PaymentDetailsRequest>({
      query: (details) => ({
        url: `paymentdetails?id=${details._id}`,
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["payment"],
    }),
    statusChange: builder.mutation<PaymentResponse, PaymentDetailsRequest>({
      query: (details) => ({
        url: `statusChange?id=${details._id}`,
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["payment"],
    }),
    statusChangeWithdraw: builder.mutation<PaymentResponse, WithdrawRequest>({
      query: (details) => ({
        url: `withdrawstatus?id=${details._id}`,
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["payment"],
    }),
    withdrawRequest: builder.mutation<PaymentResponse, WithdrawRequest>({
      query: (withdrawData) => ({
        url: `withdraw?id=${withdrawData._id}`,
        method: "POST",
        body: withdrawData,
      }),
      invalidatesTags: ["payment"],
    }),
  }),
});

export const getPayment = async (id: string) => {
  const { data }: { data: PaymentResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER}/api/v1/payment/${id}`
  );
  return data;
};

export const {
  useCreatePaymentIntentMutation,
  usePaymentDetailsMutation,
  useWithdrawRequestMutation,
  useStatusChangeMutation,
  useStatusChangeWithdrawMutation,
} = paymentAPI;
