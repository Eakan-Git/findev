const JobOverView = ({job}) => {
  return (
    <div className="widget-content">
      <ul className="job-overview">
      <li>
          <i className="icon icon-degree"></i>
          <h5>Số năm kinh nghiệm</h5>
          <span>
          {job?.min_yoe === job?.max_yoe
                  ? job.min_yoe === 0
                    ? "Không yêu cầu kinh nghiệm"
                    : `Kinh nghiệm từ ${job.min_yoe} năm`
                  : `Kinh nghiệm từ ${job.min_yoe} - ${job.max_yoe}
                    năm`}
          </span>
        </li>
      <li>
          <i className="icon icon-salary"></i>
          <h5>Mức lương</h5>
          <span>
          {job?.min_salary === -1 && job?.max_salary === -1
                                        ? "Thỏa thuận"
                                        : job?.min_salary === 0 && job?.max_salary === 0
                                        ? "Không lương"
                                        : job?.min_salary === 0 && job?.max_salary > 0
                                        ? `Lên đến ${job?.max_salary} triệu`
                                        : `${job?.min_salary} - ${job?.max_salary} triệu`}
          </span>
        </li>
        <li>
          <i className="icon icon-num-of-hire"></i>
          <h5>Số lượng tuyển</h5>
          <span>
            {job?.recruit_num}
          </span>
        </li>
        <li>
          <i className="icon icon-expiry"></i>
          <h5>Hạn nộp</h5>
          <span>
          <span>{(new Date(job?.deadline)).toLocaleDateString('en-GB')}</span>
          </span>
        </li>
        <li>
          <i className="icon icon-location"></i>
          <h5>Địa điểm làm việc</h5>
          <span>
          {job?.location}
          </span>
        </li>
        <li>
          <i className="icon icon-user-2"></i>
          <h5>Vị trí</h5>
          <span>
            {job?.position}
          </span>
        </li>
        <li>
          <i className="icon icon-clock"></i>
          <h5>Hình thức làm việc</h5>
          <span>
            {job?.type}
          </span>
        </li>
        <li>
          <i className="icon icon-calendar"></i>
          <h5>Ngày đăng</h5>
          <span>{(new Date(job?.created_at)).toLocaleDateString('en-GB')}</span>
        </li>
      </ul>
    </div>
  );
};

export default JobOverView;
