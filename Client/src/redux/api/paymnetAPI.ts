import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import { 
  MessageResponse, 
  PaymentResponse, 
  PaymentDetailsRequest, 
  WithdrawRequest 
} from "../../types/apiTypes";

export const paymentAPI = createApi({
  reducerPath: "paymentApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/payment/`, // Update base URL as necessary
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
        url: "paymentdetails",
        method: "POST",
        body: details,
      }),
      invalidatesTags: ["payment"],
    }),
    withdrawRequest: builder.mutation<PaymentResponse, WithdrawRequest>({
      query: (withdrawData) => ({
        url: "withdraw",
        method: "POST",
        body: withdrawData,
      }),
      invalidatesTags: ["payment"],
    }),
    fetchPayment: builder.query<PaymentResponse, string>({
      query: (id) => `fetch/${id}`, // Assuming there's an endpoint to fetch payment details by ID
      providesTags: ["payment"],
    }),
  }),
});

// Create a separate function to get payment details if needed
export const getPayment = async (id: string) => {
  const { data }: { data: PaymentResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER}/api/v1/payment/${id}` // Update endpoint as necessary
  );
  return data;
};

// Export hooks for usage in functional components
export const {
  useCreatePaymentIntentMutation,
  usePaymentDetailsMutation,
  useWithdrawRequestMutation,
  useFetchPaymentQuery,
} = paymentAPI;
