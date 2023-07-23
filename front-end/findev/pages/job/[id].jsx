import dynamic from "next/dynamic";
import jobs from "../../data/job-featured";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader2";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import RelatedJobs from "../../components/job-single-pages/related-jobs/RelatedJobs";
import JobOverView from "../../components/job-single-pages/job-overview/JobOverView";
import JobSkills from "../../components/job-single-pages/shared-components/JobSkills";
import JobCate from "../../components/job-single-pages/shared-components/JobCate";
import CompanyInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import SocialTwo from "../../components/job-single-pages/social/SocialTwo";
import Contact from "../../components/job-single-pages/shared-components/Contact";
import JobDetailsDescriptions from "../../components/job-single-pages/shared-components/JobDetailsDescriptions";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import ReportJobModalContent from "../../components/job-single-pages/shared-components/ReportJobModalContent";
import Link from "next/link";
import { localUrl } from "../../utils/path";
import axios from "axios";
import { useSelector } from "react-redux";
import CachedIcon from '@mui/icons-material/Cached';
import { Modal, Button } from 'react-bootstrap';


const JobSingleDynamicV1 = () => {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [job, setJob] = useState(null);
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = router.query.id;
  const user = useSelector((state) => state.user);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    const getJob = async () => {
      try {
        const res = await axios.get(`${localUrl}/jobs/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user?.token
          }
        });
  
        const fetchedJob = res.data?.data?.job;
        setJob(fetchedJob || null);
        setCompany(fetchedJob?.employer_profile || null);
        const isJobSaved = res.data?.data?.job.is_saved;
        console.log("isJobSaved: ",isJobSaved);
        setIsSaved(isJobSaved);
      } catch (err) {
        router.push('/404');
      } finally {
        setIsLoading(false);
      }
    };
  
    if (id) {
      getJob();
    }
  }, [id]);
  
  
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton UI component
  }

  if (error) {
    return <div>Error: {error}</div>; // You can display a proper error message or retry option here
  }


   const handleSaveJob = async () => {
    // console.log("user: ",user)
    // if(!user) {
    //   alert("Bạn cần đăng nhập để lưu công việc này");
    //   return;
    // }

    if (isSaved === true) {
      try {
        // Xác nhận trạng thái đang lưu
        setIsSaving(true);

        // Gửi request xóa công việc
        const params = new URLSearchParams();
        params.append('user_id', user.userAccount.id);
        params.append('job_id', id);

        const response = await axios.delete(`${localUrl}/saved-jobs/user-job`, {
          data: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': user.token
          }
        });

        // Xử lý phản hồi nếu cần

        // Cập nhật giá trị isSaved sau khi xóa thành công
        setIsSaved(false);
      } catch (error) {
        console.error('Failed to delete saved job:', error);
      } finally {
        // Kết thúc trạng thái lưu
        setIsSaving(false);
      }
      console.log("Job removed from saved list");
    } else {
      try {
        // Xác nhận trạng thái đang lưu
        setIsSaving(true);
        // Gửi request lưu công việc
        await axios.post(
          `${localUrl}/saved-jobs/`,
          {
            'user_id': `${user.userAccount.id}`,
            'job_id' : id
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': user.token
            },
          }
        );

        // Cập nhật giá trị isSaved sau khi lưu thành công
        setIsSaved(true);
      } catch (err) {
        console.log(err);
      } finally {
        // Kết thúc trạng thái lưu
        setIsSaving(false);
      }
      console.log("Job added to saved list");
    }
  };

  return (
    <>
      <Seo pageTitle={job?.title} />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section style-two">
        <div className="job-detail-outer">
          <div className="auto-container">
            <div className="row">
              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                <div className="job-block-outer">
                  <div className="job-block-seven style-two">
                    <div className="inner-box">
                      <div className="content">
                        <h4>{job?.title}</h4>

                        <ul className="job-info">
                          <li>
                            <span className="icon flaticon-briefcase"></span>
                            {job?.employer_profile?.company_profile?.name || "Chưa cập nhật"}
                          </li>
                          {/* compnay info */}
                          <li>
                            <span className="icon flaticon-map-locator"></span>
                            {job?.location || "Chưa cập nhật"}
                          </li>
                          {/* location info */}
                          <li>
                            <span className="icon flaticon-clock-3"></span>{" "}
                            {job?.deadline}
                          </li>
                          {/* time info */}
                          <li>
                            <span className="icon flaticon-money"></span>{" "}
                            {job?.min_salary === -1 && job?.max_salary === -1
                                        ? "Thỏa thuận"
                                        : job?.min_salary === 0 && job?.max_salary === 0
                                        ? "Không lương"
                                        : job?.min_salary === 0 && job?.max_salary > 0
                                        ? `Lên đến ${job.max_salary} triệu`
                                        : `${job.min_salary} - ${job.max_salary} triệu`}
                          </li>
                          {/* salary info */}
                        </ul>
                        {/* End .job-info */}

                        {/* <ul className="job-other-info"> */}
                          {/* jobType: [
                              {
                                  styleClass: "time",
                                  type: "Full Time",
                              },
                              {
                                  styleClass: "privacy",
                                  type: "Private",
                              },
                              {
                                  styleClass: "required",
                                  type: "Urgent",
                              },
                                ], */}
                          {/* {company?.jobType?.map((val, i) => (
                            <li key={i} className={`${val.styleClass}`}>
                              {val.type}
                            </li>
                          ))}
                        </ul> */}
                        {/* End .job-other-info */}
                      </div>
                      {/* End .content */}
                    </div>
                  </div>
                  {/* <!-- Job Block --> */}
                </div>
                {/* End .job-block-outer */}

                {/* <figure className="image">
                  <img src="/images/resource/job-post-img.jpg" alt="resource" />
                </figure> */}
                <JobDetailsDescriptions job={job}/>
                {/* End jobdetails content */}

                <div className="other-options">
                  <div className="social-share">
                    <h5>Chia sẻ công việc</h5>
                    <SocialTwo />
                  </div>
                </div>
                {/* <!-- Other Options --> */}

                <div className="related-jobs">
                  <div className="title-box">
                    <h3>Công việc liên quan</h3>
                    {/* <div className="text">
                      2020 jobs live - 293 added today.
                    </div> */}
                  </div>
                  {/* End title box */}

                  <RelatedJobs title={job?.title || ""} />
                </div>
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}

              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar">
                  <div className="btn-box"
                  >
                    <a
                      href="#"
                      className="theme-btn btn-style-one"
                      data-bs-toggle={user ? "modal" : "modal"}
                      data-bs-target={user ? "#applyJobModal" : "#loginPopupModal"}
                    >
                      Ứng tuyển ngay
                    </a>
                    {isSaving ? (
                      <button className="bookmark-btn" disabled>
                        <i ><CachedIcon/></i>
                      </button>
                    ) : (
                      isSaved ? (
                        <button
                          className="bookmark-btn"
                          style={{ background: "var(--primary-color)", color: "white" }}
                          onClick={handleSaveJob}
                        >
                          <i className="flaticon-bookmark"></i>
                        </button>
                      ) : (
                        <button className="bookmark-btn" 
                        onClick={handleSaveJob}
                        data-bs-toggle={user ? "" : "modal"}
                        data-bs-target={user ? "" : "#loginPopupModal"}
                        >
                          <i className="flaticon-bookmark"></i>
                        </button>
                      )
                    )}
                  </div>
                  {/* End apply for job btn */}

                  {/* <!-- Modal --> */}
                  <div
                    className="modal fade"
                    id="applyJobModal"
                    tabIndex="-1"
                    aria-hidden="true"
                  >
                    <div className="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                      <div className="apply-modal-content modal-content">
                        <div className="text-center">
                          <h3 className="title">Nộp đơn ứng tuyển</h3>
                          <button
                            type="button"
                            className="closed-modal"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                          ></button>
                        </div>
                        {/* End modal-header */}

                        <ApplyJobModalContent user={user} />

                        {/* End PrivateMessageBox */}
                      </div>
                      {/* End .send-private-message-wrapper */}
                    </div>
                  </div>
                  {/* End .modal */}

                  <div className="sidebar-widget">
                    {/* <!-- Job Overview --> */}
                    <h4 className="widget-title">Tóm tắt công việc</h4>
                    {/* pass job as param to JobOverView */}
                    <JobOverView job={job} />
                    {/* <!-- Map Widget --> */}
                    {/* <h4 className="widget-title">Job Location</h4>
                    <div className="widget-content">
                      <div className="map-outer">
                        <div style={{ height: "300px", width: "100%" }}>
                          <MapJobFinder />
                        </div>
                      </div>
                    </div> */}
                    {/* <!--  Map Widget --> */}
                    <br />
                    <h4 className="widget-title">Kĩ năng cần có</h4>
                    <div className="widget-content">
                      {/* pass skills from job to JobSkills components */}
                      <JobSkills skills={job?.skills} />
                    </div>
                    <br />
                    <h4 className="widget-title">Ngành nghề</h4>
                    <div className="widget-content">
                      <JobCate cates={job?.categories} />
                    </div>
                    <br />

                    <div className="btn-box">
                      <button
                        className="theme-btn btn-style-two"
                        onClick={handleModalOpen}
                      >
                      <div className="text-center">
                        Báo cáo công việc không phù hợp
                      </div>
                      </button>
                    </div>

                   {/* <!-- Modal --> */}
                   <Modal
                      show={isModalOpen}
                      onHide={handleModalClose}
                      dialogClassName="modal-dialog modal-dialog-centered modal-dialog-scrollable"
                    >
                      <Modal.Header closeButton={false}>
                      <div className="apply-modal-content modal-content">
                      <div className="text-center">
                      <h3 className="title">Báo cáo công việc</h3>
                      <button
                        type="button"
                        className="closed-modal"
                        data-bs-dismiss="modal"
                        aria-label="Close"
                        onClick= {handleModalClose}
                      ></button>
                      </div>
                    </div>
                      </Modal.Header>
                      <Modal.Body>
                        <ReportJobModalContent id={id} onClose={handleModalClose} />
                      </Modal.Body>
                    </Modal>
                     {/* End .send-private-message-wrapper */}
                   </div>
                 {/* End .modal */}

                  {/* End .sidebar-widget */}

                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <img src={job?.employer_profile.company_profile.logo} alt="resource" />
                        </div>
                        <h5 className="company-name">{job?.employer_profile?.company_profile?.name}</h5>
                        {/* <a href="#" className="profile-link">
                          View company profile
                        </a> */}
                      </div>
                      {/* End company title */}

                      <CompanyInfo company={job?.employer_profile}/>

                      <div className="btn-box">
                        <a
                          className="theme-btn btn-style-three"
                          href={`/employer/${job?.employer_profile?.company_id}`}
                        >
                         {/* Link to employer/id page */}
                            Xem trang công ty
                        </a>
                      </div>
                      {/* End btn-box */}
                    </div>
                  </div>
                  {/* End .company-widget */}

                  {/* <div className="sidebar-widget contact-widget">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="widget-content">
                      <div className="default-form">
                        <Contact />
                      </div>
                    </div>
                  </div> */}
                  {/* End contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}
            </div>
          </div>
        </div>
        {/* <!-- job-detail-outer--> */}
      </section>
      {/* <!-- End Job Detail Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default dynamic(() => Promise.resolve(JobSingleDynamicV1), {
  ssr: false,
});
