import { User } from "./types";

export type CustomError = {
  status: number;
  data: {
    message: string;
    success: boolean;
  };
};

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
  user?: User;
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
  upiId?: string;
}

export interface PaymentDetailsRequest {
  _id: string;
  id?: string;
  amount: number;
  referenceNumber: string;
  status?: string;
}

export interface WithdrawRequest {
  _id: string;
  id?: string;
  coins: number;
  accNo: string;
  ifsc: string;
  bankName: string;
  receiverName: string;
  contact: number;
  status?: string;
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

export type upiType = {
  upiId: string;
  _id: string;
};

export type upiTypeResponse = {
  success: boolean;
  message: string;
  upiId?: string;
  upiIds?: upiType[];
};

export type addCoinsType = {
  userId: string;
  coins: number;
  adminUserId: string;
};

export type addCoinsResponse = {
  success: boolean;
  message: string;
  user: User;
};
