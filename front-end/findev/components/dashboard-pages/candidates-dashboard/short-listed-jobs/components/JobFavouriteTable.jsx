import Link from "next/link.js";
import jobs from "../../../../../data/job-featured.js";

const JobFavouriteTable = () => {
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Danh sách công việc đã lưu</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div>
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Tên Công Việc</th>
                  <th>Ngày Lưu</th>
                  <th>Trạng Thái</th>
                  <th>Hành Động</th>
                </tr>
              </thead>

              <tbody>
                {jobs.slice(0, 12).map((item) => (
                  <tr key={item.id}>
                    <td>
                      {/* <!-- Job Block --> */}
                      <div className="job-block">
                        <div className="inner-box">
                          <div className="content">
                            <span className="company-logo">
                              <img src={item.logo} alt="logo" />
                            </span>
                            <h4>
                              <Link href={`/job/${item.id}`}>
                                {item.jobTitle}
                              </Link>
                            </h4>
                            <ul className="job-info">
                              <li>
                                <span className="icon flaticon-briefcase"></span>
                                Segment
                              </li>
                              <li>
                                <span className="icon flaticon-map-locator"></span>
                                London, UK
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>Dec 5, 2020</td>
                    <td className="status">Còn mở</td>
                    <td>
                      <div className="option-box">
                        <ul className="option-list">
                          {/* <li>
                            <button data-text="View Aplication">
                              <span className="la la-eye"></span>
                            </button>
                          </li> */}
                          <li>
                            <button data-text="Xóa khỏi danh sách">
                              <span className="la la-trash"></span>
                            </button>
                          </li>
                        </ul>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
    </div>
  );
};

export default JobFavouriteTable;
