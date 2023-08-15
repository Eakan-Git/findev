import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localUrl } from "../../../utils/path.js";
import axios from "axios";
import { useRouter } from "next/router";

const ApplyJobModalContent = (user) => {
  const router = useRouter();
  const id = router.query.id;
  const [cvList, setCvList] = useState([]);
  const [checkBoxTb, setCheckBoxTb] = useState(false);
  const [selectedCVID, setSelectedCVID] = useState("");
  const [isCheckedError, setIsCheckedError] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleDropdownChange = (event) => {
    setSelectedCVID(event.target.value);
  };

  const handleCheckBoxChange = (event) => {
    setIsChecked(event.target.checked);
  };

  const handleCheckBoxTbChange = (event) => {
    setCheckBoxTb(event.target.checked);
  };

  const fetchCvList = async () => {
    try {
      const res = await axios.get(
        `${localUrl}/cvs/user/${user.user.userAccount.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: user.user.token,
          },
        }
      );
      setCvList(res.data.data.cv);
    } catch (error) {
      console.log(error);
    }
  };

  // useEffect(() => {
  //   fetchCvList();
  // }, []);
  useEffect(() => {
    setIsChecked(false);
    setCheckBoxTb(false);
    setSelectedCVID("");
    setIsSubmitted(false);
    fetchCvList();
  }, [id]);
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isChecked) {
      setIsCheckedError(true);
      return;
    }
    try {
      const formData = new FormData();
      formData.append("select_timetable", checkBoxTb);
      formData.append("job_id", id);
      formData.append("user_id", user.user.userAccount.id);
      formData.append("cv_id", selectedCVID);

      const response = await fetch(`${localUrl}/applications`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${user.user.token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else if (response.status === 403) {
        alert("Bạn đã ứng tuyển vào công việc này rồi");
      } else {
        alert("Đã có lỗi xảy ra, vui lòng thử lại sau");
      }
    } catch (error) {
      alert("Đã có lỗi xảy ra xin hãy thử lại sau");
      console.log(error);
    }
    finally {
      setCheckBoxTb(false);
      setSelectedCVID("");
      setIsCheckedError(false);
      setIsChecked(false);
    }
  };

  return (
    <>
      {isSubmitted ? (
        <div className="text-center">
          <p>Đơn ứng tuyển đã được gửi thành công!</p>
        </div>
      ) : (
        <form className="default-form job-apply-form" onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-12 col-md-12 col-sm-12 form-group">
              <div className="uploading-outer apply-cv-outer">
                {cvList.length === 0 ? (
                  <>
                    <div
                      style={{
                        color: "red",
                        textAlign: "center",
                        marginBottom: "10px",
                      }}
                    >
                      Bạn chưa có CV nào trong kho lưu trữ
                    </div>
                    <span data-bs-dismiss="modal">
                      <Link
                        className="theme-btn btn-style-two w-100"
                        href={"/profile/cv-manager"}
                      >
                        Đăng CV ngay
                      </Link>
                    </span>
                  </>
                ) : (
                  <>
                    <select
                      className="uploadButton"
                      required
                      onChange={handleDropdownChange}
                    >
                      <option value="">Chọn CV</option>
                      {cvList.map((cv) => (
                        <option key={cv.id} value={cv.id}>
                          {cv.cv_name}
                        </option>
                      ))}
                    </select>
                    <div className="col-lg-12 col-md-12 col-sm-12 form-group mt-3">
                      <div className="input-group checkboxes square">
                        <input
                          type="checkbox"
                          name="remember-me"
                          id="rememberMe1"
                          onChange={handleCheckBoxTbChange}
                        />
                        <label htmlFor="rememberMe1" className="remember">
                          <span className="custom-checkbox" />{" "}
                          <span> Tôi đồng ý gửi kèm </span>
                          <span data-bs-dismiss="modal">
                            <Link href={"/profile/my-schedule"}>
                              thời gian biểu{" "}
                            </Link>
                          </span>
                          <span>của mình </span>
                        </label>
                      </div>
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                      <div className="input-group checkboxes square">
                        <input
                          type="checkbox"
                          name="remember-me"
                          id="rememberMe2"
                          onChange={handleCheckBoxChange}
                        />
                        <label htmlFor="rememberMe2" className="remember">
                          <span className="custom-checkbox" />
                          Tôi đã đọc và đồng ý với{" "}
                          <span data-bs-dismiss="modal">
                            <Link href="#">
                              Các Điều khoản và Chính sách bảo mật của FinDev
                            </Link>
                          </span>
                        </label>
                      </div>
                      {isCheckedError && (
                        <p className="error-message" style={{color: "red"}}>
                          Vui lòng tích vào ô đồng ý điều khoản.
                        </p>
                      )}
                    </div>

                    <div className="col-lg-12 col-md-12 col-sm-12 form-group">
                      <button
                        className="theme-btn btn-style-one w-100"
                        type="submit"
                        name="submit-form"
                        id="submit-form"
                        disabled={cvList.length === 0}
                      >
                        Gửi đơn ứng tuyển
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
          {/* End .col */}
        </form>
      )}
    </>
  );
};

export default ApplyJobModalContent;
