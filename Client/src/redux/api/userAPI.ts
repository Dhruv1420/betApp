import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import axios from "axios";
import {
  DeleteUserRequest,
  MessageResponse,
  UserResponse,
  UsersResponse,
} from "../../types/apiTypes";
import { User } from "../../types/types";

type RegisterUser = {
  name: string;
  email: string;
  password: string;
  phone: number;
  gender: string;
  referalCode: string;
};

export const userAPI = createApi({
  reducerPath: "userApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${import.meta.env.VITE_SERVER}/api/v1/user/`,
  }),
  tagTypes: ["users"],
  endpoints: (builder) => ({
    register: builder.mutation<MessageResponse, RegisterUser>({
      query: (user) => ({
        url: "new",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    login: builder.mutation<MessageResponse, User>({
      query: (user) => ({
        url: "login",
        method: "POST",
        body: user,
      }),
      invalidatesTags: ["users"],
    }),
    deleteUser: builder.mutation<MessageResponse, DeleteUserRequest>({
      query: ({ userId, adminUserId }) => ({
        url: `${userId}?id=${adminUserId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query<UsersResponse, string>({
      query: (id) => `all?id=${id}`,
      providesTags: ["users"],
    }),
  }),
});

export const getUser = async (id: string) => {
  const { data }: { data: UserResponse } = await axios.get(
    `${import.meta.env.VITE_SERVER}/api/v1/user/${id}`
  );
  return data;
};

// Export hooks for usage in functional components
export const {
  useRegisterMutation,
  useLoginMutation,
  useDeleteUserMutation,
  useAllUsersQuery,
} = userAPI;
