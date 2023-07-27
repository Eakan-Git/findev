import Link from "next/link";
import { useState, useEffect } from "react";
import { localUrl } from "../../../../../utils/path.js";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";
import axios from "axios";
import { useSelector } from "react-redux";
const JobFavouriteTable = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.user);
  const [SavedJobs, setSavedJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLinks ,setPaginationLinks ] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  useEffect(() => {
    const fetchJobListings = async () => {
      try {
        const res = await axios.get(`${localUrl}/saved-jobs?user_id=${user.userAccount.id}&page=${currentPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': user.token
          }
        }
        );
        if (!res.error) {
          setSavedJobs(res.data.data.saved_jobs.data);
          setPaginationLinks(res.data.data.saved_jobs.links)
          setLastPage(res.data.data.saved_jobs.last_page);
        }
      console.log("Dayy: ", res);
      } catch (error) {
        if (error.response && error.response.data.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
        }
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, [currentPage]);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  const handleDeleteSavedJob = async (id) => {
    const url = `${localUrl}/saved-jobs/${id}`;
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${user.token}`,
    };
    // ask for confirmation
    const confirmation = confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmation) {
      try {
        setIsLoading(true);
        const res = await fetch(url, { method: "DELETE", headers });
        if (!res.error) {
          const data = await res.json();
          if (!data.error) {
            alert("Xóa thành công");
            const updatedJobs = SavedJobs.filter(job => job.id !== id);
            setSavedJobs(updatedJobs);
          } else {
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
          }
        }
      } catch (error) {
        if (error.response && error.response.data.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
        }
      }
      setIsLoading(false);
    }
  };

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
  

  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Danh sách công việc đã lưu</h4>
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
                  <th>Hành Động</th>
                </tr>
              </thead>

              <tbody>
                {SavedJobs.length === 0 ? (
                  <tr>
                    <td colSpan="4">Bạn chưa lưu công việc nào</td>
                  </tr>
                ) : (
                  SavedJobs.map((item) => (
                    <tr key={item.job.id}>
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
                                  {/* get substring before ':' of item.job.location 
                                      else get 20 first characters of item.job.location
                                  */}
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
                        <div className="option-box">
                          <ul className="option-list">
                            <li>
                              <button data-text="Xóa công việc" onClick={() => handleDeleteSavedJob(item.id)}>
                              {isLoading ? 
                            (<span className="fa fa-spinner fa-spin" style={{color: "blue"}}></span>)
                            : (<span className="la la-trash"></span>)}
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
      <nav className="ls-pagination">
      <ul>
        {paginationLinks.map((link, index) => {
          if (link.active) {
            return (
              <li key={index}>
                <a
                  className="current-page"
                  onClick={() => {
                    handlePageChange(link.label)
                  }}
                >
                  {link.label}
                </a>
              </li>
            );
          } else {
            return (
              <li key={index}>
                <a
                  onClick={() => handlePageChange(link.label)}
                >
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

export default JobFavouriteTable;
