import Link from "next/link";
import { useEffect, useState } from "react";
import { localUrl } from "/utils/path";
const JobFilterTab = () => {
    const [jobFeatured, setJobFeatured] = useState(null);
    const fetchJobFeatured = async () => {
        try {
            const res = await fetch(`${localUrl}/jobs?top=asc`);
            const data = await res.json();
            // console.log(data);
            setJobFeatured(data.data.jobs.data);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchJobFeatured();
    }
    , []);
    return (
        <>
            {/* <!--Tab--> */}
            <div className="tab active-tab" data-aos="fade-up">
                <div className="row">
                <>
                            {jobFeatured?.slice(0, 6).map((item) => (
                                <div
                                    className="job-block col-lg-6 col-md-12 col-sm-12"
                                    key={item.id}
                                >
                                    <div className="job-block" key={item.job_id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img src={item.employer_profile.company_profile.logo} alt="item brand" />
              </span>
              <h4>
                <Link href={`/job/${item.id}`}>
                  {item.title}
                </Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  <Link href={`/employer/${item.employer_profile.company_id}`}
                  alt={item.employer_profile.company_profile.name}
                  title={item.employer_profile.company_profile.name}
                  >
                  {item.employer_profile.company_profile.name.length > 12 ? item.employer_profile.company_profile.name.slice(0, 12) + "..." : item.employer_profile.company_profile.name }
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

                                </div>
                                // End job-block
                            ))}
                        </>
                </div>
            </div>
        </>
    );
};

export default JobFilterTab;
