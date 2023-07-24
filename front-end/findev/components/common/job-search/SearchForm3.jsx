import { useState } from "react";
import Router from "next/router";

const SearchForm3 = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    
    let url = "/search?";
    if(!keyword && !location) {
      Router.push('find-jobs');
    }
    else {
      if (keyword) {
        url += `keyword=${encodeURIComponent(keyword)}&`;
      }
      
      if (location) {
        url += `addresses=${encodeURIComponent(location)}&`;
      }
      
      console.log(url);
      Router.push(url.slice(0, -1));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="row">
        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-7 col-md-12 col-sm-12">
          <span className="icon flaticon-search-1"></span>
          <input
            type="text"
            name="keyword"
            placeholder="Tên công việc, kỹ năng hoặc công ty..."
            value={keyword}
            onChange={(event) => setKeyword(event.target.value)}
          />
        </div>

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <span className="icon flaticon-map-locator"></span>
          <input
            type="text"
            name="location"
            placeholder="Thành phố"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
          />
        </div>

        {/* <!-- Form Group --> */}
        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one">
            Tìm kiếm
          </button>
        </div>
      </div>
    </form>
  );
};

export default SearchForm3;
