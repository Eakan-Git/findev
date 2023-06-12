import FooterDefault from "../../footer/common-footer";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader from "../../header/DefaulHeader";
import MobileMenu from "../../header/MobileMenu";
import FilterJobBox from "./FilterJobBox";
import JobSearchForm from "./JobSearchForm";
// import Header from "../../home-4/Header";
import { useRouter } from "next/router";
import { searchUrl } from "/utils/path";
const index = () => {
  const router = useRouter();
  const { keyword, location } = router.query;
  // console.log(keyword, location);
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
          {/* <JobSearchForm /> */}
          <h2 className="text-center">Công việc FinDev gợi ý cho bạn</h2>
          <br />
          <h5 className="text-center">Đây là các công việc được FinDev sàng lọc và gợi ý dựa trên dữ liệu bạn đã cung cấp</h5>
        </div>
      </section>
      {/* <!--End Page Title--> */}

      <section className="ls-section">
        <div className="auto-container">
          <div className="row">
            <div className="content-column col-lg-12">
              <div className="ls-outer">
                <FilterJobBox />
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

export default index;