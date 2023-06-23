import FooterDefault from "../../../components/footer/common-footer";
import LoginPopup from "../../common/form/login/LoginPopup";
import DefaulHeader from "../../header/DefaulHeader2";
import MobileMenu from "../../header/MobileMenu";
import FilterTopBox from "./FilterTopBox";
import CompanySearchForm from "./CompanySearchForm";

const index = () => {
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

            <section className="page-title">
                <div className="auto-container">
                    <CompanySearchForm />
                    {/* <!-- Job Search Form --> */}
                </div>
            </section>
            {/* <!--End Page Title--> */}

            <section className="ls-section">
                <div className="auto-container">
                    <div className="row">
                        <div className="content-column col-lg-12">
                            <div className="ls-outer">
                                <FilterTopBox />
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
