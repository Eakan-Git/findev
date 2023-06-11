import { FC } from "react";

import Paper from "@/elements/Paper";

import ListCv from "./components/ListCv";

const CvManager: FC = () => {
  return (
    <Paper>
      <h2>Quản lý CV</h2>
      <p>Danh sách CV đã lưu</p>
      <ListCv />
    </Paper>
  );
};

export default CvManager;
