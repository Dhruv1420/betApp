export type User = {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  referalCode: string;
  _id: string;
  coins: number;
  role: string;
  status: string;
  withdrawHistory: [
    {
      coins: number;
      status: string;
    }
  ];
  paymentHistory: [
    {
      amount: number;
      referenceNumber: string;
    }
  ];
};
export interface PaymentResponse {
  success: boolean;
  amount?: number;
  url?: string;
  message?: string;
  user?: any; // Adjust according to your user schema
}

export interface PaymentDetailsRequest {
  id: string; // User ID
  amount: number;
  referenceNumber: string;
}

export interface WithdrawRequest {
  id: string; // User ID
  coins: number;
}
