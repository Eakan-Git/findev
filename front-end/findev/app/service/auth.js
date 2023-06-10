import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { localUrl } from "../../utils/path";
export const loginApi = createApi({
  reducerPath: "loginApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${localUrl}/auth-user/`,
  }),
  endpoints: (builder) => ({
    login: builder.mutation({
      query: (data) => ({
        url: "sign-in",
        method: "POST",
        body: data,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "sign-up",
        method: "POST",
        body: data,
      }),
    }),
  }),
});
export const { useLoginMutation, useRegisterMutation } = loginApi;
