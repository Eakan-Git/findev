import Map from "../../../Map";

const ContactInfoBox = () => {
  return (
    <form className="default-form">
      <div className="row">
        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Quốc gia</label>
          <select className="chosen-single form-select" required>
          <option>Việt Nam</option>
            <option>Nhật Bản</option>
            <option>Singapore</option>
            <option>Hoa Kỳ</option>
            <option>Ấn Độ</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-6 col-md-12">
          <label>Thành phố</label>
          <select className="chosen-single form-select" required>
            <option>Thành phố Hồ Chí Minh</option>
            <option>Nhật Bản</option>
            <option>Singapore</option>
            <option>Hoa Kỳ</option>
            <option>Ấn Độ</option>
          </select>
        </div>

        {/* <!-- Input --> */}
        <div className="form-group col-lg-12 col-md-12">
          <label>Địa chỉ</label>
          <input
            type="text"
            name="name"
            placeholder="227 Nguyễn Văn Cừ, Phường 4, Quận 5"
            required
          />
        </div>

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-6 col-md-12">
          <label>Find On Map</label>
          <input
            type="text"
            name="name"
            placeholder="329 Queensberry Street, North Melbourne VIC 3051, Australia."
            required
          />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Latitude</label>
          <input type="text" name="name" placeholder="Melbourne" required />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-3 col-md-12">
          <label>Longitude</label>
          <input type="text" name="name" placeholder="Melbourne" required />
        </div> */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <button className="theme-btn btn-style-three">Search Location</button>
        </div> */}

        {/* <div className="form-group col-lg-12 col-md-12">
          <div className="map-outer">
            <div style={{ height: "420px", width: "100%" }}>
              <Map />
            </div>
          </div>
        </div> */}
        {/* End MapBox */}

        {/* <!-- Input --> */}
        {/* <div className="form-group col-lg-12 col-md-12">
          <button type="submit" className="theme-btn btn-style-one">
            Save
          </button>
        </div> */}
      </div>
    </form>
  );
};

export default ContactInfoBox;
