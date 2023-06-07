// Desc: Profile service
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { localUrl } from "../../utils/path";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${localUrl}/user-profiles/`,
    prepareHeaders: (headers) => {
        const token = useSelector((state) => state.user.token);
        console.log(token);
      if (token) {
        headers.set("Authorization", `${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getProfile: builder.query({
      query: (id) => `${id}`,
    }),
    updateProfile: builder.mutation({
      query: (data) => ({
        url: `${data.id}`,
        method: "PUT",
        body: data,
      }),
    }),
  }),
});

export const { useGetProfileQuery, useUpdateProfileMutation } = profileApi;
