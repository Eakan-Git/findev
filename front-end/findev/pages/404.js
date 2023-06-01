import dynamic from "next/dynamic";
import Link from "next/link";
import Seo from "../components/common/Seo";

const index = () => {
  return (
    <>
      <Seo pageTitle="Trang không tồn tại" />
      <div
        className="error-page-wrapper "
        style={{
          backgroundImage: `url(/images/404.jpg)`,
        }}
        data-aos="fade"
      >
        <div className="content">
          <div className="logo">
            <Link href="/">
              <img src="/images/logo.png" alt="brand" />
            </Link>
          </div>
          {/* End logo */}

          <h1>404!</h1>
          <p>Trang bạn đang đi đến không tồn tại hoặc không khả dụng.</p>

          <Link className="theme-btn btn-style-three call-modal" href="/">
            VỀ TRANG CHỦ
          </Link>
        </div>
        {/* End .content */}
      </div>
    </>
  );
};

export default dynamic(() => Promise.resolve(index), { ssr: false });
