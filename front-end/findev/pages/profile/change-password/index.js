import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import ChangePassword from "../../../components/dashboard-pages/candidates-dashboard/change-password";

const index = () => {
  return (
    <>
      <Seo pageTitle="Đổi mật khẩu" />
      <ChangePassword />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
