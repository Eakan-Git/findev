import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import ShortListedJobs from "../../../components/dashboard-pages/candidates-dashboard/short-listed-jobs";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Công việc đã lưu" />
      <ShortListedJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
