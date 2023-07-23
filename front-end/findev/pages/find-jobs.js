import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import FindJobs from "../components/job-listing-pages/job-list-v5";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Tìm việc" />
      <FindJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
