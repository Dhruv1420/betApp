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
