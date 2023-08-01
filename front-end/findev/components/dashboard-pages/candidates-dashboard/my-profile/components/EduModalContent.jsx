import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localUrl } from "/utils/path.js";
import {fetchedProfile} from "./my-profile/fetchProfile"
import {axios} from "axios"

const EduModalContent = ({ user, onClose, reloadData  }) => {
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [currentYear] = useState(new Date().getFullYear());
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  };
    // convert date to yyyy-MM-dd
  const convertDate = (date) => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const convertedDate = `${year}-${month}-${day}`;
    return convertedDate;
  }
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (new Date(start) >= new Date(end)) {
      alert("Ngày bắt đầu phải nhỏ hơn ngày kết thúc. Vui lòng chọn lại.");
      return;
    }
    try {
      const res = await fetch(`${localUrl}/user-educations`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          'user_id': user.userAccount.id,
          'university': university,
          'major': major !== "" ? major : undefined,
          'start': start,
          'end': end,
        })
      });
      if (res.error) {
        alert(res.message);
      }
      const data = await res.json();
      console.log(data); 
      reloadData();
      onClose();
      setUniversity("");
      setMajor("");
      setStart("");
      setEnd("");
    } catch (error) {
      alert("Dữ liệu không hợp lệ. Vui lòng thử lại.");
    }
  };


  return (
    <form className="default-form job-apply-form" onSubmit={handleSubmit}>
      <div className="row">
        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Tên trường của bạn"
            value={university}
            onChange={(e) => setUniversity(e.target.value)}
            required
            maxLength={50}
          ></input>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Chuyên ngành (nếu có)"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
            maxLength={30}
          ></input>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 form-group">
        <label>Ngày bắt đầu</label>
        <input
          type="month"
          className="form-control"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
          min={"2010-01"}
          max = {`${currentYear}-12`}
        />
      </div>

      <div className="col-lg-6 col-md-6 col-sm-6 form-group">
        <label>Ngày kết thúc </label>
        <input
          type="month"
          className="form-control"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
          min={start ? start : "2010-01"}
          // max = {`${currentYear}-12`}
        />
      </div>


        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <button className="theme-btn btn-style-one w-100" type="submit" name="submit-form">
            Lưu
          </button>
        </div>
      </div>
    </form>
  );
};

export default EduModalContent;
