import Router from "next/router";

const SearchForm3 = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <form onClick={handleSubmit}>
      <div className="row">
        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-7 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="field_name"
            placeholder="Tên công việc, kỹ năng hoặc công ty..."
          />
        </div>

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input type="text" name="field_name" placeholder="Thành phố" />
        </div>

        {/* <!-- Form Group --> */}
        {/* <div className="form-group col-lg-3 col-md-12 col-sm-12 category">
          <span className="icon flaticon-briefcase"></span>
          <select className="chosen-single form-select">
            <option defaultValue="">Nhóm công việc</option>
            <option defaultValue="44">Công nghệ thông tin</option>
            <option defaultValue="106">Tài Chính</option>
            <option defaultValue="46">Ngân Hàng</option>
            <option defaultValue="48">Thiết Kế</option>
            <option defaultValue="47">Bán Hàng</option>
            <option defaultValue="45">Bán thời gian</option>
          </select>
        </div> */}

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button
            type="submit"
            className="theme-btn btn-style-one"
            onClick={() => Router.push("/find-jobs")}
          >
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm3;
