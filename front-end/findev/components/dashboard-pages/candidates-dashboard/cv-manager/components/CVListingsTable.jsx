import Link from "next/link";
import { useState, useEffect } from "react";
import { localUrl } from "/utils/path";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";

const CVListingsTable = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [cvListings, setCvListings] = useState([]);
  // get profile
  useEffect(() => {
    const getProfile = async () => {
      const url = `${localUrl}/user-profiles/${user?.userAccount?.id}`;
      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${user.token}`,
      };
      try {
        const response = await fetch(url, { headers });
        if (response.message === "Unauthenticated.") {
          alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
          router.push("/");
          dispatch(logoutUser());
        } else if (!response.error) {
          const data = await response.json();
          // console.log(data);
          if (data.error === false) {
            // console.log(data.data);  
            setProfile(data.data);
            setCvListings(data.data.user_profile.cvs);
            // console.log(data.data.user_profile.cvs);
          } else {
            alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    getProfile();
  }, [user]);
  const handleDeleteCV = (id) => {
    const cf = confirm("Bạn có chắc chắn muốn xóa CV này?");
    if (cf) {
      console.log("deleted", id);
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }
  // const handleDeleteApplication = async (id) => {
  //   const url = `${localUrl}/applications/${id}`;
  //   const headers = {
  //     Accept: "application/json",
  //     Authorization: `Bearer ${user.token}`,
  //   };
  //   // ask for confirmation
  //   const confirmation = confirm("Bạn có chắc chắn muốn xóa?");
  //   if (confirmation) {
  //     try {
  //       const response = await fetch(url, { method: "DELETE", headers });
  //       if (response.message === "Unauthenticated.") {
  //         alert("Phiên làm việc đã hết hạn, vui lòng đăng nhập lại");
  //         router.push("/");
  //         dispatch(logoutUser());
  //       } else if (!response.error) {
  //         const data = await response.json();
  //         if (!data.error) {
  //           alert("Xóa thành công");
  //           router.reload();
  //         } else {
  //           alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
  //         }
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }
  // };
  return (
    <div className="tabs-box">
      {/* <div className="widget-title"> */}
        {/* <h4>Danh sách công việc đã ứng tuyển</h4> */}

        {/* <div className="chosen-outer"> */}
          {/* <!--Tabs Box--> */}
          {/* <select className="chosen-single form-select">
            <option>Last 6 Months</option>
            <option>Last 12 Months</option>
            <option>Last 16 Months</option>
            <option>Last 24 Months</option>
            <option>Last 5 year</option>
          </select> */}
        {/* </div> */}
      {/* </div> */}
      {/* End filter top bar */}

      {/* Start table widget content */}
      {/* <div className="widget-content"> */}
        <div className="table-outer">
          <div className="table-outer">
            <table className="default-table manage-job-table">
              <thead>
                <tr>
                  <th>Tên CV</th>
                  <th>Ngày tạo</th>
                  <th>Ghi chú</th>
                  <th>Hành động</th>
                </tr>
              </thead>

              <tbody>
                {cvListings.length === 0 ? (
                  <tr>
                    <td colSpan="4">Bạn chưa có CV nào</td>
                  </tr>
                ) : (
                  cvListings.map((item) => (
                    <tr key={item.id}>
                      <td>
                        {/* <!-- Job Block --> */}
                        <div className="job-block">
                          <div className="inner-box">
                            {/* <div className="content"> */}
                              {/* <span className="company-logo"> */}
                                {/* <img
                                  src={
                                    item.job.employer_profile.company_profile
                                      .logo
                                  }
                                  alt="logo"
                                /> */}
                              {/* </span> */}
                              <h4 style={{ float: 'left', marginRight: '10px' }}>
                                <Link href={item?.cv_path || "#"} target="_blank">
                                  {item?.name || "CV chưa đặt tên"}
                                </Link>
                              </h4>
                            {/* </div> */}
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
                              <button data-text="Xem"
                                onClick={() => {
                                  window.open(item?.cv_path || "#", "_blank");
                                }}
                              >
                                <span className="la la-eye"></span>
                              </button>
                            </li>
                            <li>
                              <button data-text="Xóa CV" onClick={() => handleDeleteCV(item.id)}>
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
      {/* </div> */}
      {/* End table widget content */}
    </div>
  );
};

export default CVListingsTable;
