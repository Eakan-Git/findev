import dynamic from "next/dynamic";
import employersInfo from "../../data/topCompany";
import LoginPopup from "../../components/common/form/login/LoginPopup";
import FooterDefault from "../../components/footer/common-footer";
import DefaulHeader from "../../components/header/DefaulHeader";
import MobileMenu from "../../components/header/MobileMenu";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Seo from "../../components/common/Seo";
import CompanyDetailsDescriptions from "../../components/employer-single-pages/shared-components/CompanyDetailsDescriptions";
import RelatedJobs from "../../components/employer-single-pages/related-jobs/RelatedJobs";
import MapJobFinder from "../../components/job-listing-pages/components/MapJobFinder";
import Social from "../../components/employer-single-pages/social/Social";
import Contact from "../../components/job-single-pages/shared-components/Contact";

const EmployersSingleV3 = ({}) => {
  const router = useRouter();
  const [employer, setEmployersInfo] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const id = router.query.id;
  const [hiringJobs, setHiringJobs] = useState([]);
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
      <Seo pageTitle={employer.name} />

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
                    <img src={"https://via.placeholder.com/90"} alt={employer.name} title={employer.name}/>
                  </span>
                  <h4>{employer?.name}</h4>

                  <ul className="job-other-info">
                    <li className="time">Số vị trí đang tuyển – {hiringJobs.total}</li>
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
                          Số lượng nhân viên: <span>{employer.size}</span>
                        </li>
                        <li>
                          Số điện thoại: <span>{employer?.phone || "123 456 7890"}</span>
                        </li>
                        <li>
                          Email: <span>{employer?.email || "abc@gmail.com"}</span>
                        </li>
                        <li>
                          Địa chỉ: <span>{employer?.address}</span>
                        </li>
                        {/* <li>
                          Social media:
                          <Social />
                        </li> */}
                      </ul>
                      {/* End compnay-info */}

                      <div className="btn-box">
                        <a
                          href={employer?.site}
                          target="_blank"
                          className="theme-btn btn-style-three"
                        >
                          Website công ty
                        </a>
                      </div>
                      {/* btn-box */}
                    </div>
                  </div>
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
                    <h3>{hiringJobs.total} vị trí đang tuyển</h3>
                  </div>
                  {/* End .title-box */}

                  <RelatedJobs jobs={hiringJobs}/>
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
