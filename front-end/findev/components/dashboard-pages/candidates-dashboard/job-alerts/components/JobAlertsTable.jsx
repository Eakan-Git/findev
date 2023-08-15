import { useState, useEffect } from "react";
import { localUrl } from "/utils/path.js";
import { useSelector } from "react-redux";
const JobAlertsTable = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginationLinks, setPaginationLinks] = useState([]);
  const [lastPage, setLastPage] = useState(0);
  const { user } = useSelector((state) => state.user);
  const [jobs, setJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [jobType, setJobType] = useState("unread");
  // const [jobType, setJobType] = useState("all");
  const fetchJobs = async () => {
    setIsLoading(true);
    const res = await fetch(
      `${localUrl}/user-profiles/noti/${jobType}?page=${currentPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      }
    );
    const data = await res.json();
    setJobs(data?.data?.notifications?.data);
    setPaginationLinks(data?.data?.notifications?.links);
    setLastPage(data?.data?.notifications?.last_page);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchJobs();
  }, [jobType, currentPage]);
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
  const handleMarkAsRead = async (id, e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetch(`${localUrl}/user-profiles/noti/mark-as-read/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  const handleMarkAllAsRead = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      await fetch(`${localUrl}/user-profiles/noti/mark-all-as-read`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
      window.location.reload();
      setIsLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Danh sách lời mời</h4>
        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          <select
            className="chosen-single form-select"
            value={jobType}
            onChange={(e) => {
              setJobType(e.target.value);
            }}
          >
            <option value={"unread"}>Chưa xem</option>
            <option value={"all"}>Tất cả</option>
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
                  <th>Trạng thái</th>
                  <th>Ngày Nhận</th>
                  <th>Hành Động</th>
                </tr>
              </thead>

              <tbody>
                {jobs?.length > 0 ? (
                  <>
                    {jobs.map((item) => {
                      // comName is all text before "đã mời bạn ứng tuyển"
                      const comName = item?.data?.data?.slice(
                        0,
                        item?.data?.data?.indexOf("đã mời bạn ứng tuyển")
                      );
                      // referLink is all text after the last ": "
                      const referLink = item?.data?.data?.slice(
                        item?.data?.data?.lastIndexOf(": ") + 1
                      );
                      // jobTitle is all text after the first ": " and before the last ". Bạn có thể"
                      const jobTitle = item?.data?.data?.slice(
                        item?.data?.data?.indexOf(": ") + 2,
                        item?.data?.data?.lastIndexOf(". Bạn có thể")
                      );
                      const receivedDate = new Date(
                        item?.created_at
                      ).toLocaleDateString("vi-VN");
                      return (
                        <tr key={item.id}>
                          <td>
                            {/* <!-- Job Block --> */}
                            <div className="job-block">
                              <div className="inner-box">
                                <div className="content2">
                                  {/* <span className="company-logo">
                              <img src={item.logo} alt="logo" />
                            </span> */}
                                  <h4
                                    style={{
                                      color: item.read_at ? "black" : "red",
                                    }}
                                  >
                                    {/* <Link href={`/jobs/${item.id}`}>
                                {jobTitle}
                              </Link> */}
                                    {jobTitle}
                                  </h4>
                                  <ul className="job-info">
                                    <li>
                                      <span className="icon flaticon-briefcase"></span>
                                      {comName}
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{item.read_at ? "Đã xem" : "Chưa xem"}</td>
                          <td>{receivedDate}</td>
                          <td>
                            <div className="option-box">
                              <ul className="option-list">
                                <li>
                                  <button
                                    data-text="Xem link refer"
                                    onClick={() => {
                                      referLink.startsWith("https://") ? window.open(referLink.trim()) : window.open("https://" + referLink.trim());
                                    }}
                                  >
                                    <span className="la la-eye"></span>
                                  </button>
                                </li>
                                {!item.read_at && (
                                  <li>
                                    <button
                                      data-text="Đánh dấu đã xem"
                                      onClick={handleMarkAsRead.bind(
                                        this,
                                        item.id
                                      )}
                                    >
                                      <span className="la la-check"></span>
                                    </button>
                                  </li>
                                )}
                              </ul>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </>
                ) : (
                  <>
                    {jobType === "unread" ? (
                      <>Bạn không có lời mời nào chưa xem</>
                    ) : (
                      <>Bạn chưa nhận được lời mời nào</>
                    )}
                  </>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* End table widget content */}
      <nav
        className="ls-pagination"
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

export default JobAlertsTable;
