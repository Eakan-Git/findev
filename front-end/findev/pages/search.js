import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import FindJobs from "../components/job-listing-pages/search-list";
const Index = () => {

  return (
    <>
      <Seo pageTitle="Tìm kiếm" />
      <FindJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
