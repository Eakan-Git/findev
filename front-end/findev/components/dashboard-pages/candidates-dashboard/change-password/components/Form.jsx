import axios from 'axios';
import { localUrl } from "../../../../../utils/path.js";
import React, { useState } from 'react';

const Form = ({ user }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmNewPassword) {
      alert("Mật khẩu mới không khớp");
      return;
    }

    try {
      await axios.put(
        `${localUrl}/user/password`,
        {
          current_password: currentPassword,
          new_password: newPassword,
          confirm_password: confirmNewPassword
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: user.token,
          },
        }
      );
      alert("Bạn đã thay đổi mật khẩu thành công");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Mật khẩu hiện tại</label>
          <input type="password" name="current_password" required value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Mật khẩu mới</label>
          <input type="password" name="new_password" required value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-7 col-md-12">
          <label>Nhập lại mật khẩu mới</label>
          <input type="password" name="confirm_new_password" required value={confirmNewPassword} onChange={(e) => setConfirmNewPassword(e.target.value)} />
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <button type="submit" className="theme-btn btn-style-one" onClick={handleChangePassword}>
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
