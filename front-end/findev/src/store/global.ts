import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

import { ESideBarEnum } from "@/constant/enum/sideBarEnum";

interface IState {
  activeItemSideBar: string;
  setActiveItemSideBar: (activeItemSideBar: string) => void;
  pagination: {
    page: number;
    limit: number;
  };
  setPagination: (pagination: { page: number; limit: number }) => void;
}

const globalStore = create<IState>()(
  devtools(
    persist(
      set => ({
        activeItemSideBar: ESideBarEnum.CV_MANAGER,
        setActiveItemSideBar: (activeItemSideBar: string) => {
          set((state: IState) => ({
            ...state,
            activeItemSideBar,
          }));
        },
        pagination: {
          page: 1,
          limit: 10,
        },
        setPagination: (pagination: { page: number; limit: number }) => {
          set((state: IState) => ({
            ...state,
            pagination,
          }));
        },
      }),
      { name: "global" }
    )
  )
);

export default globalStore;
