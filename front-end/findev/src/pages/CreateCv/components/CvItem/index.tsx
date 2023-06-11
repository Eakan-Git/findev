import { Box } from "@mui/material";
import { FC } from "react";

import Card from "@/elements/Card";

import cvItemStyles from "./cvItem.module.scss";

interface ICvItemProps {
  cvTemplate: TCvTemplate;
  handleSelectTemplate: (template: TCvTemplate) => void;
}
const CvItem: FC<ICvItemProps> = ({ cvTemplate, handleSelectTemplate }) => {
  return (
    <Box
      className={cvItemStyles.wrapper}
      onClick={() => {
        handleSelectTemplate(cvTemplate);
      }}
    >
      <Card
        style={{
          padding: 0,
          position: "relative",
        }}
      >
        <img src={cvTemplate.preview} alt="" />
        <Box className={cvItemStyles.content}>
          <h5>{cvTemplate.name}</h5>
          <p>{cvTemplate.decription}</p>
        </Box>
      </Card>
    </Box>
  );
};

export default CvItem;
