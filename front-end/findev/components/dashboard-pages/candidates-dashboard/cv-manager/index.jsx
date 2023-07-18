import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useRouter } from "next/router";
import { PDFDownloadLink } from "@react-pdf/renderer";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MenuToggler from "../../MenuToggler";
import CVListingsTable from "./components/CVListingsTable";
import CVTemplate from "./components/CVTemplate";
import { fetchProfile } from "./components/fetchProfile";
import {localUrl} from "/utils/path";
const index = () => {
  const { user } = useSelector((state) => state.user);
  const router = useRouter();

  const [profile, setProfile] = useState(null);

  const fileInputRef = useRef(null);

  const handleUpload = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    console.log(selectedFile);
    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', selectedFile);
  
    try {
      const response = await fetch(`${localUrl}/cvs/createCV`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
        },
        body: formData,
      });
  
      if (response.error === false) {
        // Request succeeded, handle the response
        const data = await response.json();
        console.log(data); // Handle the response data accordingly
      } else {
        // Request failed, handle the error
        console.log('Request failed:', response.status);
      }
    } catch (error) {
      console.log('An error occurred:', error);
    }
  };
  

  useEffect(() => {
    const fetchUser = async () => {
      const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
      if (fetchedProfile.error === false) {
        setProfile(fetchedProfile.data.user_profile);
      } else {
        console.log("Failed to fetch profile data");
      }
    };

    if (!user) {
      // show notification that user must login first
      alert("Bạn cần đăng nhập để xem thông tin cá nhân");
      router.push("/");
    } else {
      fetchUser();
    }
  }, [user, router]);

  return (
    <div className="page-wrapper dashboard">
      <span className="header-span"></span>
      {/* Header Span for height */}

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DashboardCandidatesHeader />
      {/* End Header */}

      <MobileMenu />
      {/* End MobileMenu */}

      <DashboardCandidatesSidebar />
      {/* End Candidates Sidebar Menu */}

      {/* Dashboard */}
      <section className="user-dashboard">
        <div className="dashboard-outer">
          <BreadCrumb title="Quản lý CV!" />
          {/* BreadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              {/* Ls widget */}
              <div className="cv-manager-widget ls-widget">
                <div className="widget-title">
                  <h4>Danh sách CV của bạn</h4>
                  <div className="CV-button-wrapper">
                    <button className="theme-btn btn-style-one" onClick={handleUpload}>
                      Đăng tải CV&nbsp;<i className="la la-cloud-upload"></i>
                    </button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      style={{ display: "none" }}
                      accept=".pdf"
                      onChange={handleFileChange}
                    />
                    &nbsp;&nbsp;
                    {profile && (
                      <PDFDownloadLink document={<CVTemplate profile={profile} />} fileName="CV.pdf">
                        <button className="theme-btn btn-style-one">
                          Tạo CV tự động&nbsp;<i className="la la-download"></i>
                        </button>
                      </PDFDownloadLink>
                    )}
                  </div>
                </div>
                {/* End widget-title */}
                <div className="widget-content">
                  <CVListingsTable user={user} />
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
      {/* End Dashboard */}
    </div>
    // End page-wrapper
  );
};

export default index;
