import { User } from "./types";

export interface UserReducerInitialState {
  user: User | null;
  loading: boolean;
}

export interface betReducerInitialState {
  bet: [
    {
      time: string;
      number: number;
      amount: number;
    }
  ];
  betStart: boolean;
  number: number;
  amount: number;
  loading: boolean;
}

export interface PaymentHistoryType {
  amount: number;
  referenceNumber: string;
}
