import { Box } from "@mui/material";
import { ReactNode, FC } from "react";

import paperStyles from "./paper.module.scss";

interface IPaperProps {
  children: ReactNode;
  style?: React.CSSProperties;
}
const Paper: FC<IPaperProps> = ({ children, style }) => {
  return (
    <Box className={paperStyles.paperWrapper} style={style}>
      {children}
    </Box>
  );
};

export default Paper;
