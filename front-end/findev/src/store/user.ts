import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface IState {
  userInfo: object | null | undefined;
  accessToken: string | null;
  saveUserInfo: (info: object) => void;
  saveAccessToken: (token: string | null) => void;
}

const userStore = create<IState>()(
  devtools(
    persist(
      set => ({
        userInfo: {},
        accessToken: null,

        saveUserInfo: info => {
          set((state: IState) => ({
            ...state,
            userInfo: info,
          }));
        },

        saveAccessToken: (token: string | null) => {
          set((state: IState) => ({
            ...state,
            accessToken: token,
          }));
        },
      }),
      { name: "user" }
    )
  )
);

export default userStore;
