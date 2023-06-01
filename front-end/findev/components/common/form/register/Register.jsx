import { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import Form from "./FormContent";
import Link from "next/link";
import { useRegisterMutation } from "../../../../app/service/auth";
import { useRouter } from "next/router";

const Register = () => {
  const router = useRouter();

  const [registerApi, { data, isError, error, isSuccess }] =
    useRegisterMutation();

  useEffect(() => {
    if (isSuccess) {
      alert(data.message);
      router.reload(window.location.pathname);
    } else if (isError) alert(error?.data.message);
  }, [isSuccess, isError]);

  const handleRegister = async (data) => {
    if (
      data.username.length === 0 ||
      data.password.length === 0 ||
      data.confirm_password.length === 0
    )
      alert("Vui lòng nhập đầy đủ thông tin");
    else if (data.password !== data.confirm_password)
      alert("Mật khẩu không khớp");
    else await registerApi(data);
  };
  return (
    <div className="form-inner">
      <h3>Đăng ký tài khoản FinDev ngay</h3>

      <Tabs>
        {/* <div className="form-group register-dual">
          <TabList className="btn-box row">
            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-user"></i> Sinh viên
              </button>
            </Tab>

            <Tab className="col-lg-6 col-md-12">
              <button className="theme-btn btn-style-four">
                <i className="la la-briefcase"></i> Nhà tuyển dụng
              </button>
            </Tab>
          </TabList>
        </div> */}
        {/* End .form-group */}

        <TabPanel>
          <Form handleRegister={handleRegister} />
        </TabPanel>

        {/* End cadidates Form */}

        {/*   <TabPanel>
          <Form />
        </TabPanel> */}
        {/* End Employer Form */}
      </Tabs>
      {/* End form-group */}

      <div className="bottom-box">
        <div className="divider">
          <span>Hoặc</span>
        </div>
        <LoginWithSocial />
      </div>
      {/* End bottom-box LoginWithSocial */}
    </div>
  );
};

export default Register;
