/* eslint-disable @typescript-eslint/no-unsafe-return */
import apiEndpoints from "@/utils/apiEndPoints";

import HTTPServices from "./HTTPServices";

const { API_AUTH_EMPLOYER, API_AUTH_COMPANY, API_EMPLOYER_PROFILES, API_EMPLOYER_ACCOUNTS } =
  apiEndpoints;

const UserServices = {
  login: async (data: TUserLogin) => {
    return await HTTPServices.post(`${API_AUTH_EMPLOYER}/sign-in`, data);
  },

  loginAdmin: async (data: TUserLogin) => {
    return await HTTPServices.post(`${API_AUTH_COMPANY}/sign-in`, data);
  },

  signup: async (data: TUserSignup) => {
    return await HTTPServices.post(`${API_EMPLOYER_ACCOUNTS}`, data);
  },

  signupAdmin: async (data: TUserSignup) => {
    return await HTTPServices.post(`${API_AUTH_COMPANY}/sign-up`, data);
  },

  getEmployers: async ({ ...params }) => {
    return await HTTPServices.get(`${API_EMPLOYER_ACCOUNTS}`, params);
  },

  getProfile: async ({ ...params }) => {
    return await HTTPServices.get(`${API_EMPLOYER_PROFILES}`, params);
  },

  getProfileById: async (id: number | string) => {
    return await HTTPServices.get(`${API_EMPLOYER_PROFILES}/${id}`);
  },
};

export default UserServices;
