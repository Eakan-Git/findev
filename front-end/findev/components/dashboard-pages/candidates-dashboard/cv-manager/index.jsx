import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import CvUploader from "./components/CvUploader";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CVListingsTable from "./components/CVListingsTable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CVTemplate from "./components/CVTemplate";
import { fetchProfile } from "./components/fetchProfile";
import { useEffect, useState } from "react";
const index = () => {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  // get user's profile
  const [profile, setProfile] = useState(null);
  const fetchUser = async () => {
      const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
      if (fetchedProfile.error === false) {
          setProfile(fetchedProfile.data.user_profile);
          // console.log("Profile:", fetchedProfile.data.user_profile);
      }
      else {
          console.log("Failed to fetch profile data");
      }
  }
  useEffect(() => {
      fetchUser();
      // console.log(profile);
  }
  , []);
  if (!user) {
    // show notification that user must login first
    alert("Bạn cần đăng nhập để xem thông tin cá nhân");
    router.push("/");
    return null;
  }
  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* <!-- Header Span for hight --> */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* <!-- End Candidates Sidebar Menu --> */}

      {/* <!-- Dashboard --> */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Quản lý CV!" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* <!-- Ls widget --> */}
              <div className="cv-manager-widget ls-widget">
              <div className="widget-title">
                  <h4>Danh sách CV của bạn</h4>
                  <div className="CV-button-wrapper">
                    <button className="theme-btn btn-style-one">
                      Đăng tải CV&nbsp;<i className="la la-cloud-upload"></i>
                    </button>
                    &nbsp;&nbsp;
                    <PDFDownloadLink document={<CVTemplate profile={profile}/>} fileName="CV.pdf">
                      <button className="theme-btn btn-style-one">
                        Tạo CV tự động&nbsp;<i className="la la-download"></i>
                      </button>
                    </PDFDownloadLink>
                  </div>
                </div>
                {/* End widget-title */}
                <div className="widget-content">
                  <CVListingsTable user={user} />
                  {/* <CvUploader /> */}
                </div>
                {/* End widget-content */}
              </div>
              {/* End Ls widget */}
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <CVTemplate profile={profile}/> */}
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
