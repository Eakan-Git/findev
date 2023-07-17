import MobileMenu from "../../../header/MobileMenu";
import LoginPopup from "../../../common/form/login/LoginPopup";
import DashboardCandidatesSidebar from "../../../header/DashboardCandidatesSidebar";
import BreadCrumb from "../../BreadCrumb";
import MyProfile from "./components/my-profile";
import SocialNetworkBox from "./components/SocialNetworkBox";
import ContactInfoBox from "./components/ContactInfoBox";
import CopyrightFooter from "../../CopyrightFooter";
import DashboardCandidatesHeader from "../../../header/DashboardCandidatesHeader";
import MenuToggler from "../../MenuToggler";
import {useState, useEffect} from "react";
import axios from 'axios';
import localUrl from "../../../../utils/path.js"
import { useSelector } from "react-redux";
const index = () => {
  const { user } = useSelector((state) => state.user);
  const handleUploadCV = async (e) => {
    const file = e.target.files[0];

    // Tạo một đối tượng FormData để đính kèm file
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Gửi yêu cầu POST đến API với file đính kèm
      const response = await axios.post(
        'http://20.242.247.247/api/cv/read-cv',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      const data = response?.data.user_profile;
      const newEducation = {
        university : data?.educations.university,
        major : data?.educations.major,
        start : data?.educations.start,
        end : data?.educations.end,
      };
      await axios.post(`${localUrl}/user-educations/`, newEducation,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        }
      })

      const newProfile = {
        full_name: data?.full_name,
        avatar: data?.avatar,
        about_me: data?.about_me,
        good_at_position: data?.good_at_position,
        date_of_birth: data?.date_of_birth,
        address: data?.address,
        email: data?.email,
        phone: data?.phone,
      };
      await axios.put(`${localUrl}/user-profiles/`, newProfile,
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        }
      })

    const experiences = data?.experience; 
      for (const experience of experiences) {
        await axios.post(`${localUrl}/user-experiences`, 
        {
          tittle : achievement.description,
          position: achievement.position,
          description: achievement.description,
          start: achievement.start,
          end: achievement.end,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token,
          }
        }
        )
      }

      const achievements = data?.achievements; 
      for (const achievement of achievements) {
        await axios.post(`${localUrl}/user-achievements`, 
        {
          description : achievement.description
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token,
          }
        }
        )
      }

      const skills = data?.skills; 
      for (const skill of skills) {
        await axios.post(`${localUrl}/user-achievements`, 
        {
          skill : skill.skill
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token,
          }
        }
        )
      }
    } catch (error) {
      console.error(error);
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
