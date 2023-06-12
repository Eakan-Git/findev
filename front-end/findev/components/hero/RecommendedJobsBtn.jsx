import Link from "next/link";
import { useSelector } from "react-redux";
const RecommendedJobsBtn = () => {
    const {user} = useSelector((state) => state.user);
    // console.log(user);
    if(!user) return (
        <div className="popular-searches" data-aos="fade-up" data-aos-delay="1200">
            <br />
            <br />
            <br />
            <br />
            <h2 className="title">Đăng ký tài khoản ngay để được gợi ý công việc phù hợp nhất</h2>
        </div>
    );
    return (
      <div className="popular-searches" data-aos="fade-up" data-aos-delay="1200">
        <br />
        <br />
        <br />
        <br />
        <h2 className="title">Công việc Findev gợi ý cho bạn</h2>
        {/* button */}
        {/* <div className="btn-box"> */}
            <br />
            <Link href="/recommended-jobs"
            className="btn-style-two"
            >
                XEM NGAY
            </Link>
        {/* </div> */}
      </div>
    );
  };
  
export default RecommendedJobsBtn;