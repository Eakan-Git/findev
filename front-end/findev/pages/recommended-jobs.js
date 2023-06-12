import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import FindJobs from "../components/job-listing-pages/recommended-list";
const index = () => {

  return (
    <>
      <Seo pageTitle="Công việc được gợi ý" />
      <FindJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
