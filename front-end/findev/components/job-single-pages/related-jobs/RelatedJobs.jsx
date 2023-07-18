import Link from "next/link";
import { relevantUrl } from "../../../utils/path";
import { useState, useEffect } from "react";
import axios from "axios"
const RelatedJobs = ({ title }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const queryUrl = `${relevantUrl}/${encodeURIComponent(title)}`;
  useEffect(() => {
    const getJob = async () => {
      try {
        console.log(queryUrl);
        const res = await axios.get(`${queryUrl}`);
        // if (res.error) {
        //   console.log(res.error)
        // }
        // const resData = await res.json();
        console.log(res);
        const fetchedJob = res?.data.data;
        // console.log(fetchedJob);
        setJobs(fetchedJob || null);
      } catch (err) {
        setError(err.message);
        console.log(err)
      } finally {
        setLoading(false);
      }
    };
      getJob();
  }, [title]);

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (jobs.length < 1) {
    return <div>Không tìm thấy công việc tương tự.</div>;
  }
  return (
    <>
      {jobs.slice(1,6).map((item) => (
        <div className="job-block" key={item.job_id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img src={item.company_logo} alt="item brand" />
              </span>
              <h4>
                <Link href={`/job/${item.job_id}`}>
                  {item.title}
                </Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  <Link href={`/employer/${item.company_id}`}
                  alt={item.company_name}
                  title={item.company_name}
                  >
                  {item.company_name.length > 20 ? item.company_name.slice(0, 20) + "..." : item.company_name }
                  </Link>
                </li>
                {/* compnay info */}
                <li>
                  <span className="icon flaticon-map-locator"></span>
                  {item.location.split(":")[0]}
                </li>
                {/* location info */}
                <li>
                  <span className="icon flaticon-clock-3"></span> {item.deadline}
                </li>
                {/* time info */}
                <li>
                  <span className="icon flaticon-money"></span> 
                  {item.min_salary === -1 && item.max_salary === -1
                                        ? "Thỏa thuận"
                                        : item.min_salary === 0 && item.max_salary === 0
                                        ? "Không lương"
                                        : item.min_salary === 0 && item.max_salary > 0
                                        ? `Lên đến ${item.max_salary}tr`
                                        : `${item.min_salary} - ${item.max_salary}tr`}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                {item.jobType}
              </ul>
              <ul className="job-other-info">
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
              </ul>
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
