import Link from "next/link";
import { searchUrl } from "../../../utils/path";
import { useState, useEffect } from "react";
import axios from "axios";

const RelatedJobs = ({ title }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const queryUrl = `${searchUrl}${encodeURIComponent(title)}`;
  const getJobs = async () => {
    try {
      setLoading(false);
      console.log("Start fetching data...");
      console.log(queryUrl);
      // const res = await axios.get(queryUrl);
      const res = await axios.get(`http://127.0.0.1:8001/jobs/${title}`);
      console.log(res);
      setJobs(res.data);
    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    } finally {
      console.log("End fetching data...");
      setLoading(true);
    }
  };
  useEffect(() => {
    getJobs();
  }, []);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (!jobs.length) {
    return <div>Không tìm thấy công việc tương tự.</div>;
  }
  return (
    <>
      {jobs.slice(0, 4).map((item) => (
        <div className="job-block" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img src={item.logo} alt="item brand" />
              </span>
              <h4>
                <Link href={`/job/${item.id}`}>
                  <a>{item.jobTitle}</a>
                </Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  {item.company}
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span> {item.time}
                </li>
                {/* time info */}
                <li>
                  <span className="icon flaticon-money"></span> {item.salary}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {item.jobType.map((val, i) => (
                  <li key={i} className={`${val.styleClass}`}>
                    {val.type}
                  </li>
                ))}
              </ul>
              {/* <ul className="job-other-info">
                <li className="time">{item.type}</li>
                <li className="required">Số lượng: {item.recruit_num}</li>
                <li className="yoe">
                {item.min_yoe === item.max_yoe
                  ? item.min_yoe === 0
                    ? "Không yêu cầu kinh nghiệm"
                    : `Kinh nghiệm từ ${item.min_yoe} năm`
                  : `Kinh nghiệm từ ${item.min_yoe} - ${item.max_yoe}
                    năm`}
                </li>
              </ul> */}
              {/* End .job-other-info */}

              {/* <button className="bookmark-btn">
                <span className="flaticon-bookmark"></span>
              </button> */}
            </div>
          </div>
        </div>
        // End job-block
      ))}
    </>
  );
};

export default RelatedJobs;
