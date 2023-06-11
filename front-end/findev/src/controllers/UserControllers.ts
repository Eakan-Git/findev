/* eslint-disable @typescript-eslint/no-unsafe-return */
import UserServices from "@/services/UserServices";

const UserControllers = {
  login: async (data: TUserLogin) => {
    return await UserServices.login(data);
  },

  signup: async (data: TUserSignup) => {
    return await UserServices.signup(data);
  },

  getProfile: async ({ ...params }) => {
    return await UserServices.getProfile(params);
  },

  updateProfile: async (data: TProfile) => {
    return await UserServices.updateProfile(data);
  },

  uploadCv: async (data: FormData) => {
    return await UserServices.uploadCv(data);
  },
};

export default UserControllers;
