import { ROUTES } from "../../utils/routes";
import { ESideBarEnum, ESideBarEnumLabel } from "../enum/sideBarEnum";

export const sideBarData: TSideBar[] = [
  {
    id: ESideBarEnum.CV_MANAGER,
    title: ESideBarEnumLabel.CV_MANAGER,
    path: ROUTES.CV_MANAGER,
  },
  {
    id: ESideBarEnum.TIME_TABLE,
    title: ESideBarEnumLabel.TIME_TABLE,
    path: ROUTES.TIME_TABLE,
  },
  {
    id: ESideBarEnum.PROFILE,
    title: ESideBarEnumLabel.PROFILE,
    path: ROUTES.PROFILE,
  },
  {
    id: ESideBarEnum.CREATE_CV,
    title: ESideBarEnumLabel.CREATE_CV,
    path: ROUTES.CREATE_CV,
  },
];
