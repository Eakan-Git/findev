import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import Timetable from "../../../components/dashboard-pages/candidates-dashboard/my-schedule";

const index = () => {
  return (
    <>
      <Seo pageTitle="Thời Gian Biểu" />
      <Timetable />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
