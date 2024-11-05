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
        credentials: "include",
      }),
      invalidatesTags: ["users"],
    }),
    allUsers: builder.query<UsersResponse, string>({
      query: (id) => ({
        url: `all?id=${id}`,
        credentials: "include",
      }),
      providesTags: ["users"],
    }),
    getUser: builder.query<MessageResponse, string>({
      query: (id) => ({
        url: `${id}`,
        credentials: "include",
      }),
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

export const {
  useRegisterMutation,
  useLoginMutation,
  useDeleteUserMutation,
  useAllUsersQuery,
  useGetUserQuery,
} = userAPI;
