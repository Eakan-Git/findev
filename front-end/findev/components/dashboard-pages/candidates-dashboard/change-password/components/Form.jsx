
const Form = ({user}) => {
  const handleChangePassword = (e) => {
    e.preventDefault();
    const { current_password, new_password, confirm_new_password } = e.target;
    if (new_password.value !== confirm_new_password.value) {
      alert("Mật khẩu mới không khớp");
      return;
    }
    const data = {
      current_password: current_password.value,
      new_password: new_password.value,
    };
    console.log(data);
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
