import Box from "@mui/material/Box";
import { ReactNode } from "react";

import cardStyles from "./card.module.scss";

const Card = ({ children }: { children: ReactNode }) => {
  return <Box className={cardStyles.cardWrapper}>{children}</Box>;
};

export default Card;
