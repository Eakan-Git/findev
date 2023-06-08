import { ReactNode } from "react";

import layoutStyles from "./layoutContainer.module.scss";
const LayoutContainer = ({ children }: { children: ReactNode }) => {
  return <section className={layoutStyles.layoutContainer}>{children}</section>;
};

export default LayoutContainer;
