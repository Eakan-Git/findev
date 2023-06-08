import { Box } from "@mui/material";
import { FC } from "react";

import titleStyles from "./title.module.scss";

interface ITitle {
  title: string;
  description?: string;
}

const Title: FC<ITitle> = ({ title, description }) => {
  return (
    <Box className={`${titleStyles.titleContainer} `}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
    </Box>
  );
};

export default Title;
