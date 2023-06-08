import { Box, Button, Menu, MenuItem } from "@mui/material";
import { MouseEvent, useState } from "react";
import { NavLink } from "react-router-dom";

import userStore from "@/store/user";

import headerStyles from "./header.module.scss";

export default function Header() {
  const userInfo = userStore(state => state.userInfo);
  const saveUserInfo = userStore(state => state.saveUserInfo);
  const saveAccessToken = userStore(state => state.saveAccessToken);

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event: MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const logout = () => {
    saveUserInfo({});
    saveAccessToken(null);
  };

  return (
    <header className={headerStyles.headerWrapper}>
      <Box className={headerStyles.header}>
        <h1>Header</h1>
        {userInfo ? (
          <Box className={headerStyles.userInfo}>
            <Button
              id="basic-button"
              aria-controls={isOpen ? "basic-menu" : undefined}
              aria-haspopup="true"
              aria-expanded={isOpen ? "true" : undefined}
              onClick={handleClick}
              className={headerStyles.userInfoButton}
            >
              {/* <img
                className={headerStyles.avatar}
                src={userInfo.avatar ? userInfo.avatar : "https://picsum.photos/300"}
                onError={e => {
                  e.currentTarget.src = "https://picsum.photos/300";
                }}
                alt=""
              />

              <span>{userInfo.role === "admin" ? userInfo.username : userInfo.full_name}</span> */}
            </Button>
            <Menu
              className={headerStyles.menu}
              id="basic-menu"
              anchorEl={anchorEl}
              open={isOpen}
              onClose={handleClose}
              MenuListProps={{
                "aria-labelledby": "basic-button",
              }}
              anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
              transformOrigin={{ vertical: "top", horizontal: "right" }}
            >
              <MenuItem
                onClick={() => {
                  handleClose();
                  logout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Box>
        ) : (
          <NavLink to="/auth">
            <Button
              id="basic-button"
              sx={{
                textTransform: "none",
              }}
            >
              Login
            </Button>
          </NavLink>
        )}
      </Box>
    </header>
  );
}
