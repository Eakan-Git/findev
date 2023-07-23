import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import FindJobs from "../components/job-listing-pages/recommended-list";
const Index = () => {

  return (
    <>
      <Seo pageTitle="Công việc được gợi ý" />
      <FindJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });