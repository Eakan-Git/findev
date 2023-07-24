import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localUrl } from "/utils/path.js";
import {fetchedProfile} from "./my-profile/fetchProfile"
import {axios} from "axios"

const ExpsModalContent = ({ user, onClose, reloadData  }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
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
      const res = await fetch(`${localUrl}/user-experiences`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          'user_id': user.userAccount.id,
          'description': description,
          'title': title,
          'position': position,
          'start': start,
          'end': end,
        })
      });
      if (!res.ok) {
        console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      }
      const data = await res.json();
      console.log(data); 
      reloadData();
      onClose();
      setDescription("");
      setTitle("");
      setPosition("");
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
            placeholder="Tên kinh nghiệm/công ty (vd: Công ty VNG, Đồ án tốt nghiệp,...)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          ></input>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <input
            type="text"
            className="form-control"
            placeholder="Vị trí/Tên đồ án (vd: Project Manager, Hệ thống gợi ý việc làm,...)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
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
          <textarea
            type="text"
            className="form-control"
            placeholder="Mô tả kinh nghiệm của bạn"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>
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

export default ExpsModalContent;
