"use client";
import Link from "next/link";
import {
  ProSidebarProvider,
  Sidebar,
  Menu,
  MenuItem,
  SubMenu,
} from "react-pro-sidebar";

import mobileLoginMenuData from "../../../data/mobileLoginMenuData";
import mobileLoginMenuData2 from "../../../data/mobileLoginMenuData2";
import SidebarFooter from "./SidebarFooter";
import SidebarHeader from "./SidebarHeader";
import {
  isActiveLink,
  isActiveParentChaild,
} from "../../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";

const Index = () => {
  const user = useSelector((state) => state.user.user);
  const router = useRouter();
  let content = null;
  if (user) {
    content = (
      <>
        <MenuItem>
          <Link href="/">Trang chủ</Link>
        </MenuItem>
        {mobileLoginMenuData.map((item) => (
          <SubMenu
            className={
              isActiveParentChaild(item.items, router.asPath)
                ? "menu-active"
                : ""
            }
            label={item.label}
            key={item.id}
          >
            {item.items.map((menuItem, i) => (
              <MenuItem
                className={
                  isActiveLink(menuItem.routePath, router.asPath)
                    ? "menu-active-link"
                    : ""
                }
                key={i}
                routerLink={<Link href={menuItem.routePath} />}
              >
                {menuItem.name}
              </MenuItem>
            ))}
          </SubMenu>
        ))}
        <MenuItem href="/employers">Công ty</MenuItem>
        <MenuItem href="/faq">Câu hỏi thường gặp</MenuItem>
        {mobileLoginMenuData2.map((item) => (
          <SubMenu
            className={
              isActiveParentChaild(item.items, router.asPath)
                ? "menu-active"
                : ""
            }
            label={item.label}
            key={item.id}
          >
            {item.items.map((menuItem, i) => (
              <MenuItem
                className={
                  isActiveLink(menuItem.routePath, router.asPath)
                    ? "menu-active-link"
                    : ""
                }
                key={i}
                routerLink={<Link href={menuItem.routePath} />
            }
              >
                {menuItem.name}
              </MenuItem>
            ))}
          </SubMenu>
        ))}
      </>
    );
  } else {
    content = <>
        <MenuItem href='/'>Trang chủ</MenuItem>
        <MenuItem href='/find-jobs'>Việc làm</MenuItem>
        <MenuItem href='/employers'>Công ty</MenuItem>
        <MenuItem href='/faq'>Câu hỏi thường gặp</MenuItem>
    </>
  }
  return (
    <div
      className="offcanvas offcanvas-start mobile_menu-contnet"
      tabIndex="-1"
      id="offcanvasMenu"
      data-bs-scroll="true"
    >
      <SidebarHeader />
      {/* End pro-header */}

      <ProSidebarProvider>
        <Sidebar>
          <Menu>{content}</Menu>
        </Sidebar>
      </ProSidebarProvider>

      <SidebarFooter />
    </div>
  );
};

export default Index;
