import { FC } from "react";

import CalendarScheduler from "@/elements/CalendarScheduler";
import Paper from "@/elements/Paper";

const TimeTable: FC = () => {
  return (
    <Paper>
      <h2
        style={{
          marginBottom: "1rem",
        }}
      >
        Thời gian biểu
      </h2>
      <CalendarScheduler />
    </Paper>
  );
};

export default TimeTable;
