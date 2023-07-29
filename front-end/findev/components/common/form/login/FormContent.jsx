import { useState, useEffect } from "react";
import Link from "next/link";
import LoginWithSocial from "./LoginWithSocial";
import { useLoginMutation } from "../../../../app/service/auth";
import { useDispatch } from "react-redux";
import { setUser } from "../../../../features/user/userSlice";
import { useRouter } from "next/router";
const FormContent = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [loginApi, { data: loginData, isLoading, error, isSuccess, isError }] =
    useLoginMutation();

  const handleLogin = async () => {
    if (username.length === 0 || password.length === 0)
      alert("Vui lòng nhập đầy đủ thông tin");
    else await loginApi({ username, password });
  };

  useEffect(() => {
    if (isSuccess) {
      alert(loginData.message);
      router.reload(window.location.pathname);
      dispatch(setUser(loginData.data));
    } else if (isError) alert(error?.data.message);
  }, [isSuccess, isError]);

  return (
    <div className="form-inner">
      <h3>Đăng Nhập</h3>

      {/* <!--Login Form--> */}
      <form>
        <div className="form-group">
          <label>Tên tài khoản</label>
          <input
            type="text"
            name="username"
            placeholder="Nhập tên tài khoản"
            required
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        {/* name */}

        <div className="form-group">
          <label>Mật khẩu</label>

          <input
            type="password"
            name="password"
            placeholder="Nhập mật khẩu"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* password */}

        <div className="form-group">
          <div className="field-outer">
            <div className="input-group checkboxes square">
              <input type="checkbox" name="remember-me" id="remember" />
              <label htmlFor="remember" className="remember">
                <span className="custom-checkbox"></span> Ghi nhớ đăng nhập
              </label>
            </div>
            <a href="#" className="pwd">
              Quên mật khẩu?
            </a>
          </div>
        </div>
        {/* forgot password */}

        <div className="form-group">
          <button
            className="theme-btn btn-style-one"
            type="button"
            name="log-in"
            onClick={() => handleLogin()}
            disabled={isLoading}
          >
            Đăng nhập
          </button>
        </div>
        {/* login */}
      </form>
      {/* End form */}

      <div className="bottom-box">
        <div className="text">
          Bạn không có tài khoản?{" "}
          <Link
            href="#"
            className="call-modal signup"
            data-bs-dismiss="modal"
            data-bs-target="#registerModal"
            data-bs-toggle="modal"
          >
            Đăng ký ngay!
          </Link>
        </div>

      {/* <div className="bottom-box">
        <div className="divider">
          <span>Hoặc</span>
        </div>
        <LoginWithSocial />
      </div> */}
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default FormContent;
