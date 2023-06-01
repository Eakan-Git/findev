import { useState } from "react";
const FormContent = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <form method="post" action="add-parcel.html">
      <div className="form-group">
        <label>Địa chỉ Email</label>
        <input
          type="email"
          name="username"
          placeholder="Nhập Email của bạn"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {/* name */}

      <div className="form-group">
        <label>Mật khẩu</label>
        <input
          id="password-field"
          type="password"
          name="password"
          placeholder="Nhập mật khẩu"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Nhập lại mật khẩu</label>
        <input
          id="confirm-password-field"
          type="password"
          name="confirm-password"
          placeholder="Nhập lại mật khẩu"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
      </div>
      {/* password */}

      <div className="form-group">
        <button
          className="theme-btn btn-style-one"
          onClick={() =>
            props.handleRegister({
              username: email,
              password,
              confirm_password: confirmPassword,
            })
          }
          type="button"
        >
          Đăng ký
        </button>
      </div>
      {/* login */}
    </form>
  );
};

export default FormContent;
