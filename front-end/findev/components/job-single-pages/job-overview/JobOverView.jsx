const JobOverView = ({job}) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Ngày đăng:</h5>
          <span>___</span>
        </li>
        <li>
          <i className="icon icon-num-of-hire"></i>
          <h5>Số lượng tuyển:</h5>
          <span>
            {job?.recruit_num}
          </span>
        </li>
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Hạn nộp:</h5>
          <span>
            {job.deadline}
          </span>
        </li>
        <li>
          <i className="icon icon-location"></i>
          <h5>Địa điểm làm việc:</h5>
          <span>
          {job?.job_locations.slice(0, 1)[0].location}
          </span>
        </li>
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Vị trí:</h5>
          <span>
            {job.job_types.slice(0, 1)[0].type}
          </span>
        </li>
        <li>
          <i className="icon icon-clock"></i>
          <h5>Hình thức làm việc:</h5>
          <span>
            {job.position}
          </span>
        </li>
        {/* <li>
          <i className="icon icon-rate"></i>
          <h5>Rate:</h5>
          <span>$15 - $25 / hour</span>
        </li> */}
        <li>
          <i className="icon icon-salary"></i>
          <h5>Lương:</h5>
          <span>
          {job?.min_salary === -1 && job.max_salary === -1
                                        ? "Thỏa thuận"
                                        : job.min_salary === 0 && job.max_salary === 0
                                        ? "Không lương"
                                        : job.min_salary === 0 && job.max_salary > 0
                                        ? `Lên đến ${job.max_salary} triệu`
                                        : `${job.min_salary} - ${job.max_salary} triệu`}
          </span>
        </li>
      </ul>
    </div>
  );
};

export default JobOverView;
