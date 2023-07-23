import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import CvManager from "../../../components/dashboard-pages/candidates-dashboard/cv-manager";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Quản lý CV" />
      <CvManager />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
