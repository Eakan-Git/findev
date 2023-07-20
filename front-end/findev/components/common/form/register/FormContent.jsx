import { useState } from "react";
const FormContent = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  return (
    <form method="post" action="add-parcel.html">
      <div className="form-group">
        <label>Tên đăng nhập</label>
        <input
          type="email"
          name="username"
          placeholder="Nhập tên đăng nhập"
          required
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      {/* name */}
      <div className="form-group">
        <label>Họ và tên</label>
        <input
          type="email"
          name="full_name"
          placeholder="Nhập họ và tên của bạn"
          required
          onChange={(e) => setFullName(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Mật Khẩu</label>
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
              full_name: fullName,
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
