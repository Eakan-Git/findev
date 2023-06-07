import dynamic from "next/dynamic";
import Seo from "../../../components/common/Seo";
import MyProfile from "../../../components/dashboard-pages/candidates-dashboard/my-profile";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";

const index = () => {
  // check if user is logged in
  // if not, redirect to home page and show login modal
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  if (!user) {
    // show notification that user must login first
    alert("Bạn cần đăng nhập để xem thông tin cá nhân");
    router.push("/");
    return null;
  }

  return (
    <>
      <Seo pageTitle="Thông tin cá nhân" />
      <MyProfile />
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
