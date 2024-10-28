import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PaymentState {
  paymentHistory: any[]; // You can define a proper type for the payment history
}

const initialState: PaymentState = {
  paymentHistory: [],
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    addPaymentHistory(state, action: PayloadAction<any>) {
      state.paymentHistory.push(action.payload);
    },
    // Add more reducers as needed
  },
});

// Export actions for usage
export const { addPaymentHistory } = paymentSlice.actions;

// Export the reducer to be added to the store
export const paymentReducer = paymentSlice.reducer;
