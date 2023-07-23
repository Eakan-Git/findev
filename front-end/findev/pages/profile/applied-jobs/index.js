import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import AppliedJobs from "../../../components/dashboard-pages/candidates-dashboard/applied-jobs";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Quản lý đơn ứng tuyển" />
      <AppliedJobs />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
