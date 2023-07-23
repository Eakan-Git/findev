import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import MyResume from "../../../components/dashboard-pages/candidates-dashboard/my-resume";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Mẫu Đơn Ứng Tuyển" />
      <MyResume />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
