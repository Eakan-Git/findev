import FooterDefault from "../../footer/common-footer";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FilterJobBox from "./FilterJobBox2";
import JobSearchForm from "./JobSearchForm";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { searchUrl } from "/utils/path";
const Index = () => {
  const router = useRouter();
  const [location, setLocation] = useState(router.query.location || "");
  const [category, setCategory] = useState(router.query.category || "");
  const [skill, setSkill] = useState(router.query.skill || "");
  const [title, setTitle] = useState(router.query.title || "");
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  let { page, count_per_page } = router.query;

  useEffect(() => {
    setTitle(router.query.title);
    setLocation(router.query.location || "");
    setCategory(router.query.category || "");
    setSkill(router.query.skill || "");
    page = router.query.page || 1;
    count_per_page = router.query.count_per_page || 10;
  }, [router.query]);

  useEffect(() => {
    let queryURL = `${searchUrl}`;
    let params = [];
    if (location) {
      params.push(`location=${location}`);
    }
    if (category) {
      params.push(`category=${category}`);
    }
    if (skill) {
      params.push(`skill=${skill}`);
    }
    if (title) {
      params.push(`title=${title}`);
    }
    if (page && page > 1) {
      params.push(`page=${page}`);
    }
    if (count_per_page && count_per_page !== 10) {
      params.push(`count_per_page=${count_per_page}`);
    }
    params.push(`keyword=${title}`);
    if (params.length > 0) {
      queryURL += `?${params.join("&")}`;
    }
    const fetchJobs = async () => {
      setIsLoading(true);
      const res = await fetch(queryURL);
      const data = await res.json();
      setJobs(data?.data?.jobs);
      setIsLoading(false);
    };
    fetchJobs();
  }, [location, category, skill, title, page, count_per_page]);
  return (
    <>
      {/* <!-- Header Span --> */}
      <span className="header-span"></span>

      <LoginPopup />
      {/* End Login Popup Modal */}
      <DefaulHeader />

      {/* End Header with upload cv btn */}

      <MobileMenu />
      {/* End MobileMenu */}

      <section className="page-title style-two">
        <div className="auto-container">
          <JobSearchForm title={title} location={location} />
          {/* <!-- Job Search Form --> */}
        </div>
      </section>
      {/* <!--End Page Title--> */}

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div className="content-column col-lg-12">
              <div className="ls-outer">
                <FilterJobBox jobs={jobs} isLoading={isLoading} />
              </div>
            </div>
            {/* <!-- End Content Column --> */}
          </div>
          {/* End row */}
        </div>
        {/* End container */}
      </section>
      {/* <!--End Listing Page Section --> */}

      <FooterDefault footerStyle="alternate5" />
      {/* <!-- End Main Footer --> */}
    </>
  );
};

export default Index;
