import React, { useState } from "react";
import { localUrl } from "/utils/path.js";

const ExpsModalContent = ({ user, onClose, reloadData  }) => {
  const [description, setDescription] = useState("");
  const [title, setTitle] = useState("");
  const [position, setPosition] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [currentYear] = useState(new Date().getFullYear());
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
      // console.log(data); 
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
          <label>Tên kinh nghiệm/công ty</label>
          <input
            type="text"
            className="form-control"
            placeholder="(vd: Công ty VNG, Đồ án tốt nghiệp,...)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={50}
          ></input>
        </div>

        <div className="col-lg-12 col-md-12 col-sm-12 form-group">
          <label>Vị trí/Tên đồ án</label>
          <input
            type="text"
            className="form-control"
            placeholder="(vd: Fresher, Intern, Hệ thống gợi ý việc làm,...)"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            required
            maxLength={50}
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
          min={"2010-01"}
          max = {`${currentYear}-12`}
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
          min={"2010-01"}
          // max = {`${currentYear}-12`}
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
            maxLength={255}
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
