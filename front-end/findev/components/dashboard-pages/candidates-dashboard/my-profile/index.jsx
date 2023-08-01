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
import { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { localUrl } from "/utils/path";
const Index = () => {
  const fileInputRef = useRef(null);
  const { user } = useSelector((state) => state.user);
  const [profile, setProfile] = useState(null);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleUploadCV = async (e) => {
    let file = e.target.files[0];
    let formData = new FormData();
    formData.append("file", file);
    setIsLoading(true);
    try {
      let res = await fetch(readCVUrl, {
        method: "POST",
        body: formData,
      });
      let data = await res.json();
      // console.log(data);
      // delete data.data.user_profile.avatar;
      delete data.data.user_profile.github;
      delete data.data.user_profile.link;
      data.data.user_profile.avatar || delete data.data.user_profile.avatar;
      // delete data.data.user_profile.date_of_birth;
      // change date_of_birth to yyyy/dd/mm
      let date = new Date(data.data.user_profile.date_of_birth);
      let year = date.getFullYear();
      let month = date.getMonth() + 1;
      let dt = date.getDate();
      let newDate = `${year}/${month}/${dt}`;
      data.data.user_profile.date_of_birth = newDate;
      setIsLoading(false);
      // ask user to confirm
      if (window.confirm("Bạn có muốn thay đổi thông tin không?")) {
        setProfile(data.data.user_profile);
        setIsEdit(!isEdit);
      }
      fileInputRef.current.value = "";
    } catch (error) {
      console.log("An error occurred:", error);
    }
  };

  useEffect(() => {
    // Check if isEdit is true before calling bulkUpdateProfile
    if (isEdit) {
      bulkUpdateProfile();
    }
  }, [isEdit]);

  const bulkUpdateProfile = async () => {
    try {
      const updatedFields = { ...profile };
      // console.log("updatedFields",updatedFields);
      const msg = await putProfile(user.token, updatedFields);
      alert(msg.message);
    } catch (error) {
      console.error(error);
    }
  };

  const putProfile = async (token, updatedFields) => {
    const payload = { user_profile: updatedFields };
    // console.log(JSON.stringify(payload, null, 2));
    let bodyPayload = { object: payload };
    // console.log(JSON.stringify(bodyPayload, null, 2));
    try {
      const response = await fetch(
        `${localUrl}/user-profiles/import/${user.userAccount.id}`,
        {
          method: "PUT",
          headers: {
            Accept: "application/json",
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set the proper content type header for JSON
          },
          body: JSON.stringify(bodyPayload, null, 2),
        }
      );

      if (response.error) {
        throw new Error("Error updating profile.");
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
                    <label className="theme-btn btn-style-one"
                    style={{
                      marginLeft: "1rem",
                      marginRight: "1rem",  
                      width: "50%",
                      minWidth: "14.5rem",
                      maxWidth: "20rem",
                    }}
                    >
                      {/* add a spinner if loading */}
                      {isLoading ? (
                        <span
                          className="fa fa-spinner fa-spin"
                          style={{ color: "white", marginRight: "1rem" }}
                        ></span>
                      ) : null}
                      Nhập thông tin nhanh bằng CV
                      <input
                        type="file"
                        ref={fileInputRef}
                        style={{ display: "none" }}
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

export default Index;
