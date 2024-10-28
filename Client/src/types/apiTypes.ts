import {

  User,
} from "./types";



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
  amount: number;
  url: string; // QR code URL

  

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



// You may need to adjust the structure of these interfaces according to your API response formats.
