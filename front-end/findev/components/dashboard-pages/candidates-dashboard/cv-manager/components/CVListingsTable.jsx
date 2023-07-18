import Link from "next/link";
import { useState, useEffect } from "react";
import { localUrl } from "/utils/path";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "/app/actions/userActions";
import axios from "axios";

const CVListingsTable = ({ user }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [cvListings, setCvListings] = useState([]);

  const fetchCVListings = async () => {
    const url = `${localUrl}/cvs/user/${user.userAccount.id}`;
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
        if (data.error === false) {
          console.log(data.data);
          setCvListings(data.data.cv);
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

  useEffect(() => {
    fetchCVListings();
  }, [user]);

  const handleDeleteCV = async (id) => {
    try {
      const res = await axios.delete(`${localUrl}/cvs/${id}`, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': user.token
        }
      });
      console.log("delete");
      fetchCVListings(); // Call fetchCVListings after successful deletion
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  return (
    <div className="tabs-box">
      {/* ... rest of the component ... */}
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
                      <div className="job-block">
                        <div className="inner-box">
                          <h4 style={{ float: 'left', marginRight: '10px' }}>
                            <Link href={item?.cv_path || "#"} target="_blank">
                              {item?.cv_name || "CV chưa đặt tên"}
                            </Link>
                          </h4>
                        </div>
                      </div>
                    </td>
                    <td>
                      {new Date(item.created_at).toLocaleDateString(
                        "en-GB"
                      )}
                    </td>
                    <td className="text">
                      {item?.cv_note || "Không có ghi chú"}
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
    </div>
  );
};

export default CVListingsTable;
