import Box from "@mui/material/Box";
import { CSSProperties, ReactNode } from "react";

import cardStyles from "./card.module.scss";

const Card = ({ children, style }: { children: ReactNode; style?: CSSProperties }) => {
  return (
    <Box className={cardStyles.cardWrapper} sx={style}>
      {children}
    </Box>
  );
};

export default Card;
