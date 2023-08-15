import Link from "next/link";
import { useState, useEffect } from "react";
import { localUrl } from "/utils/path";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";

const JobListingsTable = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  const handlePageChange = (page) => {
    if (typeof page === "number") {
      setCurrentPage(page);
    } else if (page === "&laquo; Previous" && currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    } else if (page === "Next &raquo;" && currentPage < lastPage) {
      setCurrentPage((prevPage) => prevPage + 1);
    } else {
      const clickedPage = parseInt(page);
      if (!isNaN(clickedPage) && clickedPage !== currentPage) {
        setCurrentPage(clickedPage);
      }
    }
  };
  const fetchApplications = async (id, token) => {
    const url = `${localUrl}/applications?user_id=${id}&page=${currentPage}`;
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    };

    try {
      const response = await fetch(url, { method: "GET", headers });
      if (response.message === "Unauthenticated.") {
        alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
        router.push("/");
        dispatch(logoutUser());
      } else if (!response.error) {
        const data = await response.json();
        return data;
      } else {
        alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const res = await fetchApplications(user.userAccount.id, user.token);
        if (!res.error) {
          setJobs(res.data.applications.data);
          setLastPage(res.data.applications.last_page);
          setPaginationLinks(res.data.applications.links);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, [currentPage]);
  const handleCVView = (cv_path) => {
    window.open(cv_path, "_blank", "noopener,noreferrer");
  }
  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Danh sách công việc đã ứng tuyển</h4>

        {/* <div className="chosen-outer">
          <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select>
        </div> */}
      </div>
      {/* End filter top bar */}

      {/* Start table widget content */}
      <div className="widget-content">
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Tên công việc</th>
                  <th>Ngày ứng tuyển</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan="4">Bạn chưa ứng tuyển công việc nào</td>
                  </tr>
                ) : (
                  jobs.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {/* <!-- Job Block --> */}
                        <div className="job-block">
                          <div className="inner-box">
                            <div className="content">
                              <span className="company-logo">
                                <img
                                  src={
                                    item.job.employer_profile.company_profile
                                      .logo
                                  }
                                  alt="logo"
                                />
                              </span>
                              <h4>
                                <Link
                                  href={`/job/${item.job.id}`}
                                  title={item.job.title}
                                >
                                  {item.job.title.length > 50
                                    ? item.job.title.slice(0, 50) + "..."
                                    : item.job.title}
                                </Link>
                              </h4>
                              <ul className="job-info">
                                <li>
                                  <span className="icon flaticon-briefcase"></span>
                                  <Link
                                    href={`/employer/${item.job.employer_profile.company_id}`}
                                  >
                                    {item.job.employer_profile.company_profile.name.length > 40
                                      ? item.job.employer_profile.company_profile.name.slice(
                                          0,
                                          40
                                        ) + "..."
                                      : item.job.employer_profile.company_profile.name}
                                  </Link>
                                </li>
                                <li>
                                  <span className="icon flaticon-map-locator"></span>
                                  {item.job.location.split(":")[0] ||
                                  item.job.location.length > 30
                                    ? item.job.location.slice(0, 30) + "..."
                                    : item.job.location}
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        {new Date(item.created_at).toLocaleDateString(
                          "en-GB"
                        )}
                      </td>
                      <td className="status"
                        style={{
                          color:
                            item.status === "Đã xem"
                              ? "green"
                              : item.status === "Đã từ chối"  
                              ? "red"
                              : "blue",
                        }}
                      >
                          {item.status}
                      </td>
                      <td>
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                            <button data-text="Xem CV đã gửi"
                            onClick={() => {handleCVView(item?.cv?.cv_path)}}
                            >
                                <span className="la la-eye"></span>
                            </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
      <nav className="ls-pagination"
        style={{
          paddingBottom: "20px",
        }}
      >
        <ul>
          {paginationLinks.map((link, index) => {
            if (link.active) {
              return (
                <li key={index}>
                  <a
                    className="current-page"
                    onClick={() => {
                      handlePageChange(link.label);
                    }}
                  >
                    {link.label}
                  </a>
                </li>
              );
            } else {
              return (
                <li key={index}>
                  <a onClick={() => handlePageChange(link.label)}>
                    {link.label === "&laquo; Previous" ? (
                      <i className="fa fa-arrow-left"></i>
                    ) : link.label === "Next &raquo;" ? (
                      <i className="fa fa-arrow-right"></i>
                    ) : (
                      link.label
                    )}
                  </a>
                </li>
              );
            }
          })}
        </ul>
      </nav>
    </div>
  );
};

export default JobListingsTable;
