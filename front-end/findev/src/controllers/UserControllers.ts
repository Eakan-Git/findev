/* eslint-disable @typescript-eslint/no-unsafe-return */
import UserServices from "@/services/UserServices";

const UserControllers = {
  login: async (data: TUserLogin) => {
    return await UserServices.login(data);
  },

  loginAdmin: async (data: TUserLogin) => {
    return await UserServices.loginAdmin(data);
  },

  signup: async (data: TUserSignup) => {
    return await UserServices.signup(data);
  },

  signupAdmin: async (data: TUserSignup) => {
    return await UserServices.signupAdmin(data);
  },

  getEmployers: async ({ ...params }) => {
    return await UserServices.getEmployers(params);
  },

  getProfile: async ({ ...params }) => {
    return await UserServices.getProfile(params);
  },

  getProfileById: async (id: number | string) => {
    return await UserServices.getProfileById(id);
  },
};

export default UserControllers;
