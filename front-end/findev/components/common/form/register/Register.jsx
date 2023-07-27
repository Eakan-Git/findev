import { useEffect } from "react";
import { Tab, Tabs, TabList, TabPanel } from "react-tabs";
import LoginWithSocial from "./LoginWithSocial";
import Form from "./FormContent";
import Link from "next/link";
import { useRegisterMutation } from "../../../../app/service/auth";
import { useRouter } from "next/router";
import { localUrl } from "../../../../utils/path";

const Register = () => {
  const router = useRouter();

  // const [registerApi, { data, isError, error, isSuccess }] =
  //   useRegisterMutation();

  // useEffect(() => {
  //   if (isSuccess) {
  //     alert(data.message);
  //     router.reload(window.location.pathname);
  //   } else if (isError) {
  //     console.log(error);
  //   }
  // }, [isSuccess, isError]);

  const handleRegister = async (data) => {
    if (
      data.username.length === 0 ||
      data.password.length === 0 ||
      data.confirm_password.length === 0 ||
      data.full_name.length === 0
    ) {
      alert("Vui lòng nhập đầy đủ thông tin");
    } else if (data.password !== data.confirm_password) {
      alert("Mật khẩu không khớp");
    } else if (!/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/.test(data.password)) {
      alert(
        "Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ cái và số, không chứa ký tự đặc biệt"
      );
    } 
    // else if (!/\S+@\S+\.\S+/.test(data.username)) {
    //   alert("Email không hợp lệ");
    // } 
    else {
      const url = `${localUrl}/auth-user/sign-up`;
      // console.log(url);
      const headers = {
        "Content-Type": "application/json",
      };
      // console.log(data);
  
      try {
        const response = await fetch(url, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });
        const result = await response.json();
  
        // Handle the result from the API
        // console.log(result);
        if(result.error === false) {
          alert(result.message);
          router.reload(window.location.pathname);
        }
        else {
          alert(result.message);
        }
        // Additional logic based on the result
  
      } catch (error) {
        console.error(error);
        // Handle the error
      }
    }
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
