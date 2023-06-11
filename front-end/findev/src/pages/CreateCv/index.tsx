import { FC } from "react";

import Paper from "@/elements/Paper";

import CvTemplates from "./components/CvTemplates";

const CreateCv: FC = () => {
  return (
    <Paper>
      <h2>Tạo CV</h2>

      <CvTemplates />
    </Paper>
  );
};

export default CreateCv;
