import dynamic from "next/dynamic";
import employersInfo from "../../data/topCompany";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader2";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import CompanyDetailsDescriptions from "../../components/employer-single-pages/shared-components/CompanyDetailsDescriptions";
import RelatedJobs from "../../components/employer-single-pages/related-jobs/RelatedJobs";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import Social from "../../components/employer-single-pages/social/Social";
import Contact from "../../components/job-single-pages/shared-components/Contact";
import ReportCompanyModalContent from "../../components/job-single-pages/shared-components/ReportCompanyModalContent";
import { Modal, Button } from 'react-bootstrap';

const EmployersSingleV3 = ({}) => {
  const router = useRouter();
  const [employer, setEmployersInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = router.query.id;
  const [hiringJobs, setHiringJobs] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleModalOpen = () => {
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };


  useEffect(() => {
    const getEmployer = async () => {
      try {
        const res = await fetch(`http://localhost:8000/api/company-profiles/${id}`);
        const resJobs = await fetch(`http://localhost:8000/api/jobs?company_id=${id}`);
        if (res.error || resJobs.error) {
          throw new Error("Failed to fetch employer");
        }
        const resData = await res.json();
        const resJobsData = await resJobs.json();
        const fetchedCompany = resData?.data?.company_profile;
        // console.log(fetchedCompany);
        setEmployersInfo(fetchedCompany || null);
        setHiringJobs(resJobsData?.data?.jobs || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      getEmployer();
    }
  }, [id]);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or skeleton UI component
  }

  if (error) {
    return <div>Error: {error}</div>; // You can display a proper error message or retry option here
  }
  return (
    <>
      <Seo pageTitle={employer?.name} />

      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}

      <DefaulHeader />
      {/* <!--End Main Header --> */}

      <MobileMenu />
      {/* End MobileMenu */}

      {/* <!-- Job Detail Section --> */}
      <section className="job-detail-section">
        {/* <!-- Upper Box --> */}
        <div className="upper-box">
          <div className="auto-container">
            <div className="job-block-seven style-three">
              <div className="inner-box">
                <div className="content">
                  <span className="company-logo">
                    <img src={employer?.logo} alt={employer?.name} title={employer?.name}/>
                  </span>
                  <h4>{employer?.name}</h4>

                  <ul className="job-other-info">
                    <li className="time">Số vị trí đang tuyển – {hiringJobs?.total > 0 ? hiringJobs?.total : 0}</li>
                  </ul>
                  {/* End .job-other-info */}
                </div>
                {/* End .content */}
              </div>
            </div>
            {/* <!-- Job Block --> */}
          </div>
        </div>
        {/* <!-- Upper Box --> */}

        {/* <!-- job-detail-outer--> */}
        <div className="job-detail-outer reverse">
          <div className="auto-container">
            <div className="row">
              <div className="sidebar-column col-lg-4 col-md-12 col-sm-12">
                <aside className="sidebar pd-right">
                  <div className="sidebar-widget company-widget">
                    <div className="widget-content">
                      {/*  compnay-info */}
                      <ul className="company-info mt-0">
                        {/* <li>
                          Ngành: <span>Công nghệ</span>
                        </li> */}
                        <li>
                          Số lượng nhân viên: <span>{employer?.size || "Chưa cập nhật"}</span>
                        </li>
                        <li>
                          Số điện thoại: <span>{employer?.phone || "123 456 7890"}</span>
                        </li>
                        <li>
                          Email: <span>{employer?.email || "placeholder@gmail.com"}</span>
                        </li>
                        <li>
                          Địa chỉ: <span>{employer?.address || "Chưa cập nhật"}</span>
                        </li>
                        {/* <li>
                          Social media:
                          <Social />
                        </li> */}
                      </ul>
                      {/* End compnay-info */}

                      <div className="btn-box">
                        <a
                          href={employer?.site || null}
                          target="_blank"
                          className="theme-btn btn-style-three"
                        >
                          Website công ty
                        </a>
                      </div>
                      {/* btn-box */}
                    </div>
                    
                  </div>
                  {/* btn-box-report */}
                  <div className="btn-box">
                  <button
                    className="theme-btn btn-style-two"
                    onClick={handleModalOpen}
                  >
                  <div className="text-center">
                    Báo cáo công ty 
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
                <h3 className="title">Báo cáo công ty</h3>
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
                  <ReportCompanyModalContent id={id} onClose={handleModalClose} />
                </Modal.Body>
              </Modal>
                  {/* End company-widget */}

                  {/* <div className="sidebar-widget"> */}
                    {/* <!-- Map Widget --> */}
                    {/* <h4 className="widget-title">Job Location</h4>
                    <div className="widget-content">
                      <div style={{ height: "300px", width: "100%" }}>
                        <MapJobFinder />
                      </div>
                    </div> */}
                    {/* <!--  Map Widget --> */}
                  {/* </div> */}
                  {/* End sidebar-widget */}

                  {/* <div className="sidebar-widget contact-widget mb-0">
                    <h4 className="widget-title">Contact Us</h4>
                    <div className="default-form">
                      <Contact />
                    </div>
                  </div> */}
                  {/* End contact-widget */}
                </aside>
                {/* End .sidebar */}
              </div>
              {/* End .sidebar-column */}

              <div className="content-column col-lg-8 col-md-12 col-sm-12">
                {/*  job-detail */}
                <CompanyDetailsDescriptions employer={employer}/>
                {/* End job-detail */}

                {/* <!-- Related Jobs --> */}
                <div className="related-jobs">
                  <div className="title-box">
                    <h3>Vị trí đang tuyển</h3>
                    {hiringJobs?.total > 0 ? (
                      <span className="color-text-2">
                        {hiringJobs?.total} vị trí
                      </span>
                    ) : () => null}
                  </div>
                  {/* End .title-box */}

                  {hiringJobs?.total > 0 ? (
                    <RelatedJobs jobs={hiringJobs}/>
                  ) : (
                    <div className="alert alert-warning" role="alert">
                      Không có vị trí tuyển dụng nào
                      </div>
                      )}
                  {/* End RelatedJobs */}
                </div>
                {/* <!-- Related Jobs --> */}
              </div>
              {/* End .content-column */}
            </div>
            {/* End row */}
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

export default dynamic(() => Promise.resolve(EmployersSingleV3), {
  ssr: false,
});
