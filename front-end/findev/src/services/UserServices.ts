/* eslint-disable @typescript-eslint/no-unsafe-return */
import apiEndpoints from "@/utils/apiEndPoints";

import HTTPServices from "./HTTPServices";

const { API_AUTH_USER, API_USER_PROFILES, API_USER_ACCOUNTS } = apiEndpoints;

const UserServices = {
  login: async (data: TUserLogin) => {
    return await HTTPServices.post(`${API_AUTH_USER}/sign-in`, data);
  },

  signup: async (data: TUserSignup) => {
    return await HTTPServices.post(`${API_USER_ACCOUNTS}`, data);
  },

  getProfile: async ({ ...params }) => {
    return await HTTPServices.get(`${API_USER_PROFILES}`, params);
  },

  updateProfile: async (data: TProfile) => {
    return await HTTPServices.put(`${API_USER_PROFILES}`, data);
  },

  uploadCv: async (data: FormData) => {
    return await HTTPServices.post2(`${API_USER_PROFILES}/upload-cv`, data);
  },
};

export default UserServices;
