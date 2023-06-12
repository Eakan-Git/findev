import Link from "next/link";
import { useState, useEffect } from "react";
import { localUrl } from "/utils/path";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";

const JobListingsTable = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();

  const fetchApplications = async (id, token) => {
    const url = `${localUrl}/applications?user_id=${id}`;
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
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchJobListings();
  }, []);

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  const handleDeleteApplication = async (id) => {
    const url = `${localUrl}/applications/${id}`;
    const headers = {
      Accept: "application/json",
      Authorization: `Bearer ${user.token}`,
    };
    // ask for confirmation
    const confirmation = confirm("Bạn có chắc chắn muốn xóa?");
    if (confirmation) {
      try {
        const response = await fetch(url, { method: "DELETE", headers });
        if (response.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
        } else if (!response.error) {
          const data = await response.json();
          if (!data.error) {
            alert("Xóa thành công");
            router.reload();
          } else {
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
          }
        }
      } catch (error) {
        console.error(error);
      }
    }
  };
  return (
    <div className="tabs-box">
      <div className="widget-title">
        <h4>Danh sách công việc đã ứng tuyển</h4>

        <div className="chosen-outer">
          {/* <!--Tabs Box--> */}
          {/* <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select> */}
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
                                  href={`/job/${item.id}`}
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
                            {/* <li>
                              <button data-text="View Aplication">
                                <span className="la la-eye"></span>
                              </button>
                            </li> */}
                            <li>
                              <button data-text="Xóa đơn ứng tuyển" onClick={() => handleDeleteApplication(item.id)}>
                                <span className="la la-trash"></span>
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
    </div>
  );
};

export default JobListingsTable;
