import Link from "next/link";
import jobs from "../../../data/job-featured";

const RelatedJobs = () => {
  return (
    <>
      {jobs.slice(3, 7).map((item) => (
        <div className="job-block" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img src={item.logo} alt="item brand" />
              </span>
              <h4>
                <Link href={`/job/${item.id}`}>{item.jobTitle}</Link>
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
