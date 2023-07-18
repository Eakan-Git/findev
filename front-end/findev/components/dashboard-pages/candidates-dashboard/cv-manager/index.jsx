import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CopyrightFooter from "../../CopyrightFooter";
import CvUploader from "./components/CvUploader"; // Import the CvUploader component here
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import CVListingsTable from "./components/CVListingsTable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CVTemplate from "./components/CVTemplate";
import { fetchProfile } from "./components/fetchProfile";
import { useEffect, useState } from "react";

const Index = () => {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();
  // get user's profile
  const [profile, setProfile] = useState(null);
  const fetchUser = async () => {
    const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
    if (fetchedProfile.error === false) {
      setProfile(fetchedProfile.data.user_profile);
    } else {
      console.log("Failed to fetch profile data");
    }
  };
  useEffect(() => {
    fetchUser();
  }, []);

  if (!user) {
    // show notification that the user must log in first
    alert("Bạn cần đăng nhập để xem thông tin cá nhân");
    router.push("/");
    return null;
  }

  const [isUploaderVisible, setIsUploaderVisible] = useState(false);

  const toggleUploader = () => {
    setIsUploaderVisible(!isUploaderVisible);
  };

  const handleFileUpload = (files) => {
    // Here you can write the code to handle the file upload process
    // For example, you can use APIs to save the files, titles, and notes in the database.
    console.log("Uploaded files:", files);
  };

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>

      <LoginPopup />

      <DashboardCandidatesHeader />

      <MobileMenu />

      <DashboardCandidatesSidebar />

      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Quản lý CV!" />

          <MenuToggler />

          <div className="row">
            <div className="col-lg-12">
              <div className="cv-manager-widget ls-widget">
                <div className="widget-title">
                  <h4>Danh sách CV của bạn</h4>
                  <div className="CV-button-wrapper">
                    <button className="theme-btn btn-style-one" onClick={toggleUploader}>
                      Đăng tải CV&nbsp;<i className="la la-cloud-upload"></i>
                    </button>
                    &nbsp;&nbsp;
                    <PDFDownloadLink document={<CVTemplate profile={profile} />} fileName="CV.pdf">
                      <button className="theme-btn btn-style-one">
                        Tạo CV tự động&nbsp;<i className="la la-download"></i>
                      </button>
                    </PDFDownloadLink>
                  </div>
                </div>
                {isUploaderVisible && <CvUploader user={user} onFileUpload={handleFileUpload} />}
                &nbsp;&nbsp;
                <div className="widget-content">
                  <CVListingsTable user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>


      <CopyrightFooter />
    </div>
  );
};

export default Index;
