import { Box } from "@mui/material";
import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import Header from "@/elements/Header";
import userStore from "@/store/user";

import homeTemplateStyles from "./homeTemplate.module.scss";

const HomeTemplate = ({ children }: { children: ReactNode }) => {
  const accessToken = userStore(state => state.accessToken);
  const navigate = useNavigate();

  useEffect(() => {
    console.log({ accessToken, navigate });
  }, [accessToken, navigate]);

  return (
    <section className={homeTemplateStyles.homeTemplateWrapper}>
      <Header />
      {/* <SideBar /> */}
      <Box className={homeTemplateStyles.home}>
        <Box className={homeTemplateStyles.fakeSideBar}>.</Box>
        <Box className={homeTemplateStyles.children}>{children}</Box>
      </Box>
    </section>
  );
};

export default HomeTemplate;
