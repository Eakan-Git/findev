import Link from "next/link";
const RelatedJobs = ({jobs}) => {
  return (
    <>
      {jobs.data.map((item) => (
        <div className="job-block" key={item.id}>
          <div className="inner-box">
            <div className="content">
              <span className="company-logo">
                <img src={
                  // item?.employer_profile?.company_profile?.logo || 
                  "https://via.placeholder.com/90"} alt="resource" />
              </span>
              <h4>
                <Link href={`/job/${item.id}`}>{item.title}</Link>
              </h4>

              <ul className="job-info">
                <li>
                  <span className="icon flaticon-briefcase"></span>
                  <Link href="#"
                  alt={item.employer_profile.company_profile.name}
                  title={item.employer_profile.company_profile.name}
                  >
                  {item.employer_profile.company_profile.name.length > 12 ?
                    item.employer_profile.company_profile.name.slice(0, 12) + "..." :
                    item.employer_profile.company_profile.name
                  }
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
                  <span className="icon flaticon-money"></span> {item.min_salary === -1 && item.max_salary === -1
                                        ? "Thỏa thuận"
                                        : item.min_salary === 0 && item.max_salary === 0
                                        ? "Không lương"
                                        : item.min_salary === 0 && item.max_salary > 0
                                        ? `Lên đến ${item.max_salary} triệu`
                                        : `${item.min_salary} - ${item.max_salary} triệu`}
                </li>
                {/* salary info */}
              </ul>
              {/* End .job-info */}

              <ul className="job-other-info">
                <li className="time">{item.type}</li>
                <li className="required">Số lượng: {item.recruit_num}</li>
                <li className="yoe">
                {/* if item.min_yoe == item.max_yoe -> min_yoe
                    if item.min_yoe == item.max_yoe -> min_yoe == 0 -> Không yêu cầu kinh nghiệm
                    if item.min_yoe == item.max_yoe -> min_yoe != 0 -> Kinh nghiệm từ min_yoe năm
                    if item.min_yoe != item.max_yoe -> Kinh nghiệm từ min_yoe đến max_yoe năm
                */}
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
      ))}
    </>
  );
};

export default RelatedJobs;
