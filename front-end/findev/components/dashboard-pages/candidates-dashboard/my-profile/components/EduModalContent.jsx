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
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  };
  
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
          'major': major,
          'start': start,
          'end': end,
        })
      });
      if (res.error) {
        alert(res.message);
      }
      const data = await res.json();
      // console.log(data); 
      reloadData();
      onClose();
      setUniversity("");
      setMajor("");
      setStart("");
      setEnd("");
    } catch (error) {
      console.log(error);
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
          ></input>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Chuyên ngành (nếu có)"
            value={major}
            onChange={(e) => setMajor(e.target.value)}
          ></input>
        </div>

        <div className="col-lg-6 col-md-6 col-sm-6 form-group">
        <label>Ngày bắt đầu</label>
        <input
          type="date"
          className="form-control"
          value={start}
          onChange={(e) => setStart(e.target.value)}
          required
        />
      </div>

      <div className="col-lg-6 col-md-6 col-sm-6 form-group">
        <label>Ngày kết thúc </label>
        <input
          type="date"
          className="form-control"
          value={end}
          onChange={(e) => setEnd(e.target.value)}
          required
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
