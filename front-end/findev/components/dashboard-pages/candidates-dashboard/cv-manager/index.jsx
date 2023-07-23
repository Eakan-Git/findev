import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import CvUploader from "./components/CvUploader";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import CVListingsTable from "./components/CVListingsTable";
import { PDFDownloadLink } from "@react-pdf/renderer";
import CVTemplate from "./components/CVTemplate";
import { fetchProfile } from "./components/fetchProfile";

const Index = () => {
  const { user } = useSelector((state) => state.user);
  const [selectedFile, setSelectedFile] = useState(null);
  const router = useRouter();
  const fileInputRef = useRef(null); // Create a ref for the file input element
  const [isUploaderVisible, setIsUploaderVisible] = useState(false);

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
  }
  const toggleUploader = () => {
    setIsUploaderVisible(!isUploaderVisible);
  };

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsUploaderVisible(true);
  };

  const openFileInput = () => {
    fileInputRef.current.click(); // Programmatically trigger the file input element
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
                    <button className="theme-btn btn-style-one" onClick={openFileInput}>
                      Đăng tải CV&nbsp;<i className="la la-cloud-upload"></i>
                    </button>
                    &nbsp;&nbsp;
                    {profile && (
                      <PDFDownloadLink document={<CVTemplate profile={profile} />} fileName={`${profile.full_name.replace(/ /g, '-')}_CV.pdf`}>
                        <button className="theme-btn btn-style-one">
                          Tạo CV tự động&nbsp;<i className="la la-download"></i>
                        </button>
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{ display: "none" }}
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                />
                {isUploaderVisible && <CvUploader user={user} file={selectedFile} />}
                &nbsp;&nbsp;
                <div className="widget-content">
                  <CVListingsTable user={user} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
