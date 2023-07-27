import Link from "next/link";
import React, { useState, useEffect } from "react";
import { localUrl } from "/utils/path.js";
import {fetchedProfile} from "./my-profile/fetchProfile"
import {axios} from "axios"
const AwardsModalContent = ({ user, onClose, reloadData  }) => {
  const [awardDescription, setAwardDescription] = useState("");
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${user.token}`
  };
  
  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const res = await fetch(`${localUrl}/user-achievements`, {
        method: 'POST',
        headers: headers,
        body: JSON.stringify({
          'user_id': user.userAccount.id,
          'description': awardDescription
        })
      });
      if (!res.ok) {
        console.error('Phiên làm việc đã hết hạn, vui lòng đăng nhập lại');
      }
      const data = await res.json();
      // console.log(data); 
      reloadData();
      onClose();
      setAwardDescription("");
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
            placeholder="Tên giải thưởng (vd: IELTS 8.0)"
            value={awardDescription}
            onChange={(e) => setAwardDescription(e.target.value)}
            required
          ></input>
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

export default AwardsModalContent;
