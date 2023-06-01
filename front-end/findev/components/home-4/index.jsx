import Header from "./Header";
import Footer from "./Footer";
import Hero4 from "../hero/hero-4";
import JobFilterTab from "../job-featured/JobFilterTab";
import Block2 from "../block/Block2";
import TopCompany from "../top-company/TopCompany";
import JobCategories from "../job-categories/JobCategorie1";
import Blog from "../blog/Blog";
import Partner from "../common/partner/Partner";
import LoginPopup from "../common/form/login/LoginPopup";
import MobileMenu from "../header/MobileMenu";

const index = () => {
    return (
        <>
            <LoginPopup />
            {/* End Login Popup Modal */}

            <Header />
            {/* <!--End Main Header --> */}

            <MobileMenu />
            {/* End MobileMenu */}

            <Hero4 />
            {/* <!-- End Banner Section--> */}

            <section className="job-section alternate">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <h2>🔥 Công việc HOT 🔥</h2>
                        {/* <div className="text">
                            Know your worth and find the job that qualify your
                            life
                        </div> */}
                    </div>
                    {/* End sec-title */}

                    <div className="default-tabs tabs-box">
                        <JobFilterTab />
                    </div>
                    {/* End .default-tabs */}
                </div>
            </section>
            {/* <!-- End Job Section --> */}

            <section className="process-section pt-0">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <h2>Làm sao để tìm được việc ưng ý?</h2>
                        <div className="text">Đăng ký ngay tài khoản FinDev</div>
                    </div>

                    <div className="row" data-aos="fade-up">
                        <Block2 />
                    </div>
                </div>
            </section>
            {/* <!-- End Process Section --> */}

            <section className="top-companies style-two">
                <div className="auto-container">
                    <div className="sec-title">
                        <h2>Top Công Ty</h2>
                        <div className="text">
                            Những công ty hàng đầu đang tuyển dụng tại FinDev
                        </div>
                    </div>

                    <div className="carousel-outer" data-aos="fade-up">
                        <div className="companies-carousel">
                            <TopCompany />
                        </div>
                    </div>
                </div>
            </section>
            {/* <!-- End Top Companies --> */}

            <section className="job-categories">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <h2>Danh mục công việc phổ biến</h2>
                        {/* <div className="text">
                            2020 jobs live - 293 added today.
                        </div> */}
                    </div>

                    <div
                        className="row "
                        data-aos="fade-up"
                        data-aos-anchor-placement="top-bottom"
                    >
                        {/* <!-- Category Block --> */}
                        <JobCategories />
                    </div>
                </div>
            </section>
            {/* End Job Categorie Section */}

            {/* <section className="news-section style-two">
                <div className="auto-container">
                    <div className="sec-title text-center">
                        <h2>Recent News Articles</h2>
                        <div className="text">
                            Fresh job related news content posted each day.
                        </div>
                    </div>
                    <div className="row" data-aos="fade-up">
                        <Blog />
                    </div>
                </div>
            </section> */}
            
            {/* <!-- End News Section --> */}

            {/* <section className="clients-section alternate">
                <div className="sponsors-outer" data-aos="fade">
                    <ul className="sponsors-carousel">
                        <Partner />
                    </ul>
                </div>
            </section> */}
            {/* <!-- End Clients Section--> */}

            <Footer />
            {/* <!-- End Main Footer --> */}
        </>
    );
};

export default index;
