import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localUrl } from "../../../utils/path.js";
import axios from "axios";
import { useRouter } from "next/router";
const ApplyJobModalContent = ( user ) => {
  const router = useRouter();
  const id = router.query.id;
  const [cvList, setCvList] = useState([]);
  const [checkBoxTb, setCheckBoxTb] = useState(false);
  const [isSubmitClicked, setIsSubmitClicked] = useState(false);
  const [selectedCvPath, setSelectedCvPath] = useState("");
  const [isCheckedError, setIsCheckedError] = useState(false);
  const [isChecked, setIsChecked] = useState(false)
  const handleDropdownChange = (event) => {
    setSelectedCvPath(event.target.value);
  };

  const handleCheckBoxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCheckBoxTbChange = (event) => {
    setCheckBoxTb(event.target.checked);
  };

  const fetchCvList = async () => {
    try {
      const res = await axios.get(`${localUrl}/cvs/user/${user.user.userAccount.id}`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: user.user.token,
        },
      });
      setCvList(res.data.data.cv);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCvList();
  }, []);
//select_timetable: checkBoxTb,
const handleSubmit = async (event) => {
  event.preventDefault();

  // Kiểm tra ô checkbox đã được tích vào hay chưa
  if (!isChecked) {
    setIsCheckedError(true);
    return; // Dừng xử lý nếu ô checkbox chưa được tích vào
  }
    try {
      const response = await axios.post(
        `${localUrl}/applications`,
        {
          select_timetable: checkBoxTb,
          job_id: id,
          user_id: user.user.userAccount.id,
          cv_path: selectedCvPath,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user.user.token,
          },
        }
      );

      // Xử lý phản hồi từ API nếu cần
      alert("Đơn ứng tuyển của bạn đã được gửi thành công");
    } catch (error) {
      // Xử lý lỗi nếu cần
      alert("Đã có lỗi xảy ra xin hãy thử lại sau");
      console.log(error);
    }
  };

  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <div className="uploading-outer apply-cv-outer">
            <div className="uploadButton">
              {cvList.length === 0 ? (
                <button className="uploadButton" onClick={() => (window.location.href = "/profile/cv-manager")}>
                  Bạn chưa có CV. Bấm vào đây để tạo CV.
                </button>
              ) : (
                <select className="uploadButton" required onChange={handleDropdownChange}>
                  <option value="">Chọn CV</option>
                  {cvList.map((cv) => (
                    <option key={cv.id} value={cv.cv_path}>
                      {cv.cv_name}
                    </option>
                  ))}
                </select>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* End .col */}
      

      <div className="col-lg-12 col-md-12 col-sm-12 form-group mt-3" >
        <div className="input-group checkboxes square">
          <input
            type="checkbox"
            name="remember-me"
            id="rememberMe1"
            checked={checkBoxTb}
            onChange={handleCheckBoxTbChange}
          />
          <label htmlFor="rememberMe1" className="remember">
            <span className="custom-checkbox"></span> Tôi đồng ý gửi kèm thời gian biểu của mình
          </label>
        </div>
      </div>
      {/* End .col */}

      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
        <div className="input-group checkboxes square">
          <input
            type="checkbox"
            name="remember-me"
            id="rememberMe2"
            onChange={handleCheckBoxChange}
          />
          <label htmlFor="rememberMe2" className="remember">
            <span className="custom-checkbox"></span> Tôi đã đọc và đồng ý với{" "}
            <span data-bs-dismiss="modal">
              <Link href="/terms">Các Điều khoản và Chính sách bảo mật của FinDev</Link>
            </span>
          </label>
        </div>
        {isCheckedError && (
          <p className="error-message">Vui lòng tích vào ô đồng ý điều khoản.</p>
        )}
      </div> 

      <div className="col-lg-12 col-md-12 col-sm-12 form-group">
        <button className="theme-btn btn-style-one w-100" type="submit" name="submit-form">
          Gửi đơn ứng tuyển
        </button>
      </div>
    </form>
  );
};

export default ApplyJobModalContent;
