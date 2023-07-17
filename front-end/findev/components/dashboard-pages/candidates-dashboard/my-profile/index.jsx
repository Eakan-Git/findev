import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
// import SocialNetworkBox from "./components/SocialNetworkBox";
// import ContactInfoBox from "./components/ContactInfoBox";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import { readCVUrl } from "/utils/path";
import { useState, useEffect } from "react";
// import { Modal } from "@mui/material";
import { useSelector } from "react-redux";
import { localUrl } from "/utils/path";
const index = () => {
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [defaultProfile, setDefaultProfile] = useState(null);
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [modifiedFields, setModifiedFields] = useState({});
  const openModal = () => {
    setIsOpenModal(true);
  };

  const closeModal = () => {
    setIsOpenModal(false);
  };

  const handleUploadCV = async (e) => {
    // e.preventDefault();
    const file = e.target.files[0];
    // console.log(file);
    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const res = await fetch(readCVUrl, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      // console.log(data);
      delete data.data.user_profile.avatar;
      delete data.data.user_profile.github;
      delete data.data.user_profile.link;
      delete data.data.user_profile.date_of_birth;
      setProfile(data.data.user_profile);
      // ask user to confirm
      if (window.confirm("Bạn có muốn thay đổi thông tin không?")) {
        setIsEdit(!isEdit);
      }
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };
  
  useEffect(() => {
    // console.log(profile);
    bulkUpdateProfile();
  }, [isEdit]);
  
  const bulkUpdateProfile = async () => {
    try {
      const updatedFields = {};
      Object.entries(profile).forEach(([key, value]) => {
        updatedFields[key] = value;
      });
  
      setModifiedFields(updatedFields);
      console.log(updatedFields);
      const msg = await putProfile(user.token, updatedFields);
      console.log(msg);
    } catch (error) {
      console.error(error);
    }
  };
  
  const putProfile = async (token, updatedFields) => {
    try {
      // Serialize the updatedFields object into x-www-form-urlencoded format
      const formData = new URLSearchParams();
  
      Object.entries(updatedFields).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      const response = await fetch(`${localUrl}/user-profiles/`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(), // Pass the serialized form data as the request body
      });
  
      if (response.error === true) {
        console.error(response.message);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };
  
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
          <BreadCrumb title="Thông tin cá nhân" />
          {/* breadCrumb */}

          <MenuToggler />
          {/* Collapsible sidebar button */}

          <div className="row">
            <div className="col-lg-12">
              <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Hồ sơ của bạn</h4>
                    <label className="theme-btn btn-style-one">
                    Nhập thông tin nhanh bằng CV
                    <input type="file" style={{ display: 'none' }} 
                    onChange={handleUploadCV}
                    />
                  </label>
                  </div>
                  <MyProfile />
                </div>
              </div>
              {/* <!-- Ls widget --> */}

              {/* <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Social Network</h4>
                  </div> */}
                  {/* End widget-title */}

                  {/* <div className="widget-content">
                    <SocialNetworkBox />
                  </div>
                </div>
              </div> */}
              {/* <!-- Ls widget --> */}

              {/* <div className="ls-widget">
                <div className="tabs-box">
                  <div className="widget-title">
                    <h4>Contact Information</h4>
                  </div>
                  <div className="widget-content">
                    <ContactInfoBox />
                  </div>
                </div>
              </div> */}
              {/* <!-- Ls widget --> */}
            </div>
          </div>
          {/* End .row */}
        </div>
        {/* End dashboard-outer */}
      </section>
      {/* <!-- End Dashboard --> */}

      <CopyrightFooter />
      {/* <!-- End Copyright --> */}
    </div>
    // End page-wrapper
  );
};

export default index;
