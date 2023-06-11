const Form = () => {
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
          <button type="submit" className="theme-btn btn-style-one">
            Đổi mật khẩu
          </button>
        </div>
      </div>
    </form>
  );
};

export default Form;
