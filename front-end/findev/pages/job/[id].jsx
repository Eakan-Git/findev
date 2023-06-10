import dynamic from "next/dynamic";
import jobs from "../../data/job-featured";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import RelatedJobs from "../../components/job-single-pages/related-jobs/RelatedJobs";
import JobOverView from "../../components/job-single-pages/job-overview/JobOverView";
import JobSkills from "../../components/job-single-pages/shared-components/JobSkills";
import CompanyInfo from "../../components/job-single-pages/shared-components/CompanyInfo";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import SocialTwo from "../../components/job-single-pages/social/SocialTwo";
import Contact from "../../components/job-single-pages/shared-components/Contact";
import JobDetailsDescriptions from "../../components/job-single-pages/shared-components/JobDetailsDescriptions";
import ApplyJobModalContent from "../../components/job-single-pages/shared-components/ApplyJobModalContent";
import Link from "next/link";
import { localUrl } from "../../utils/path";
import axios from "axios";
import { useSelector } from "react-redux";
const JobSingleDynamicV1 = () => {
  const router = useRouter();
  const [company, setCompany] = useState(null);
  const [job, setJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = router.query.id;
  const { user } = useSelector((state) => state.user);
  // console.log(id);
<<<<<<< Updated upstream
=======
  
>>>>>>> Stashed changes
  useEffect(() => {
    const getJob = async () => {
      try {
        const res = await fetch(`${localUrl}/jobs/${id}`);
        if (res.error) {
          throw new Error("Failed to fetch job");
        }
        const resData = await res.json();
        const fetchedJob = resData?.data?.job;
<<<<<<< Updated upstream
=======
        const res = await axios.get(`${localUrl}/jobs/${id}`, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token
          }
        });
  
        const fetchedJob = res.data?.data?.job;
>>>>>>> Stashed changes
        setJob(fetchedJob || null);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getJob();
      setCompany(job?.employer_profile || null);
    }
  }, [id]);

<<<<<<< Updated upstream
=======
  }, [id, user.token]);
  
  
>>>>>>> Stashed changes
  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton UI component
  }
@ -58,12 +65,12 @@ const JobSingleDynamicV1 = () => {
  if (error) {
    return <div>Error: {error}</div>; // You can display a proper error message or retry option here
  }

<<<<<<< Updated upstream
  const handleSaveJob = async () => {
    if (job.is_saved) {
      try {
        await axios.post(
          `${localUrl}/saved-jobs/`,
=======
  console.log(isSaved);
  const handleSaveJob = async () => {
    if (job.is_saved) {
    if (isSaved === true) {
      try {
        await axios.post(
          `${localUrl}/saved-jobs/`,
        await axios.delete(
          `${localUrl}/saved-jobs/user-job`,
>>>>>>> Stashed changes
          {
            'user_id': user.userAccount.id ,
            'job_id' : id
@ -80,10 +87,6 @@ const JobSingleDynamicV1 = () => {
      }
      console.log("Job removed from saved list");
    } else {
      console.log("job ne", job.is_saved)
      console.log("jobid:", id)
      console.log("user_id:", user.userAccount.id)
      console.log("token:", user.token  )
      try {
        await axios.post(
          `${localUrl}/saved-jobs/`,
@ -233,7 +236,7 @@ const JobSingleDynamicV1 = () => {
                    >
                      Ứng tuyển ngay
                    </a>
                    {job.is_saved ? (
<<<<<<< Updated upstream
=======
                    {isSaved ? (
>>>>>>> Stashed changes
                      <button
                        className="bookmark-btn"
                        style={{ background: "var(--primary-color)", color: "white" }}
                        onClick={handleSaveJob}
                      >
                        <i className="flaticon-bookmark"></i>
                      </button>
                    ) : (
                      <button className="bookmark-btn" onClick={handleSaveJob}>
                        <i className="flaticon-bookmark"></i>
                      </button>
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

                        <ApplyJobModalContent />
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
                      <JobSkills skills={job?.job_skills} />
                    </div>
                    <br />
                    <div className="btn-box">
                        <a
                          href="#"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="theme-btn btn-style-two"
                        >
                          Báo cáo công việc không phù hợp
                        </a>
                      </div>
                    {/* <!-- Job Skills --> */}
                  </div>
                  {/* End .sidebar-widget */}

                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      <div className="company-title">
                        <div className="company-logo">
                          <img src={job.employer_profile.company_profile.logo} alt="resource" />
                        </div>
                        <h5 className="company-name">{job?.employer_profile?.company_profile?.name}</h5>
                        {/* <a href="#" className="profile-link">
                          View company profile
                        </a> */}
                      </div>
                      {/* End company title */}

                      <CompanyInfo company={job.employer_profile}/>

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
