import { User } from "./types";

export type UsersResponse = {
  success: boolean;
  users: User[];
};

export type UserResponse = {
  success: boolean;
  user: User;
};

export type MessageResponse = {
  success: boolean;
  message: string;
};

export type DeleteUserRequest = {
  userId: string;
  adminUserId: string;
};

export interface PaymentResponse {
  success: boolean;
  amount?: number;
  url?: string;
  message?: string;
  user?: User;
}

export interface PaymentDetailsRequest {
  _id: string;
  amount: number;
  referenceNumber: string;
}

export interface WithdrawRequest {
  _id: string;
  coins: number;
}

export type BetResponse = {
  success: boolean;
  message: string;
  number: number;
  amount: number;
};

export type BetType = {
  time: Date;
  number: number;
  amount: number;
  _id: string;
};
