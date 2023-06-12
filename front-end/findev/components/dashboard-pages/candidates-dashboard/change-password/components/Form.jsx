import axios from 'axios';
import { localUrl } from "../../../../../utils/path.js";

const Form = ({ user }) => {
  const handleChangePassword = async (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_new_password } = e.target;
    if (new_password !== confirm_new_password) {
      alert("Mật khẩu mới không khớp");
      return;
    }
    try {
      await axios.post(
        `${localUrl}/company-reports/`,
        {
          current_password: current_password,
          new_password: new_password,
          confirm_password: confirm_new_password
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
        <input type="password" name="current_password" required />
      </div>

      {/* <!-- Input --> */}
      <div className="form-group col-lg-7 col-md-12">
        <label>Mật khẩu mới</label>
        <input type="password" name="new_password" required />
      </div>

      {/* <!-- Input --> */}
      <div className="form-group col-lg-7 col-md-12">
        <label>Nhập lại mật khẩu mới</label>
        <input type="password" name="confirm_new_password" required />
      </div>

      {/* <!-- Input --> */}
      <div className="form-group col-lg-6 col-md-12">
        <button type="submit" className="theme-btn btn-style-one"
          onClick={handleChangePassword}
        >
          Đổi mật khẩu
        </button>
      </div>
    </div>
  </form>
);
};

export default Form;
