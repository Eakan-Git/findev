/* eslint-disable @typescript-eslint/ban-ts-comment */
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import WorkOutlineOutlinedIcon from "@mui/icons-material/WorkOutlineOutlined";
import { FC, useEffect } from "react";
import { NavLink } from "react-router-dom";

import { ESideBarEnum } from "@/constant/enum/sideBarEnum";
import { sideBarData } from "@/constant/mocks/sideBarData";
import globalStore from "@/store/global";

import sideBarStyles from "./sideBar.module.scss";

const SideBar: FC = () => {
  const activeItemSideBar = globalStore(state => state.activeItemSideBar);
  const setActiveItemSideBar = globalStore(state => state.setActiveItemSideBar);

  const CustomIconSideBar: FC<{ icon: string }> = ({ icon }) => {
    switch (icon) {
      case ESideBarEnum.CV_MANAGER:
        return <HomeOutlinedIcon />;

      case ESideBarEnum.PROFILE:
        return <PersonOutlineOutlinedIcon />;

      case ESideBarEnum.CREATE_CV:
        return <SendOutlinedIcon />;

      case ESideBarEnum.TIME_TABLE:
        return <WorkOutlineOutlinedIcon />;

      default:
        return <></>;
    }
  };

  useEffect(() => {
    switch (window.location.pathname.slice(1)) {
      case ESideBarEnum.CV_MANAGER:
        setActiveItemSideBar(ESideBarEnum.CV_MANAGER);
        break;

      case ESideBarEnum.PROFILE:
        setActiveItemSideBar(ESideBarEnum.PROFILE);
        break;

      case ESideBarEnum.CREATE_CV:
        setActiveItemSideBar(ESideBarEnum.CREATE_CV);
        break;

      case ESideBarEnum.TIME_TABLE:
        setActiveItemSideBar(ESideBarEnum.TIME_TABLE);
        break;

      default:
        setActiveItemSideBar(ESideBarEnum.CV_MANAGER);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [window.location.pathname]);

  return (
    <aside className={sideBarStyles.sidebarWrapper}>
      <ul className={sideBarStyles.sideBar}>
        {sideBarData.map((item: TSideBar) => (
          <li
            key={item?.id}
            className={
              item?.id === activeItemSideBar
                ? `${sideBarStyles.sideNavItem} ${sideBarStyles.active}`
                : sideBarStyles.sideNavItem
            }
          >
            <NavLink to={item.path}>
              <button
                onClick={() => {
                  // @ts-ignore
                  if (Object.values(ESideBarEnum).includes(item.id)) {
                    // @ts-ignore
                    setActiveItemSideBar(item.id);
                  }
                }}
              >
                <CustomIconSideBar icon={item.id} />
                <span>{item.title}</span>
              </button>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default SideBar;
