import { useState } from "react";
import LocationBox from "./LocationBox";
import SearchBox from "./SearchBox";
import { useRouter } from "next/router";

const JobSearchForm = () => {
  const [keyword, setKeyword] = useState("");
  const [location, setLocation] = useState("");
  const router = useRouter();
  const handleSubmit = (e) => {
    e.preventDefault();
    // console.log("keyword:", keyword, "\nlocation:", location);
    if(keyword.trim() === "" && location.trim() === "") {
      return;
    }
    else if(keyword.trim() === "" && location.trim() !== ""){
      router.push(`/search?addresses=${location}`);
    }
    else if(keyword.trim() !== "" && location.trim() === ""){
      router.push(`/search?keyword=${keyword}`);
    }
    else {
      router.push(`/search?keyword=${keyword}&addresses=${location}`);
    }
  };

  return (
    <div className="job-search-form">
      <div className="row">
        <div className="form-group col-lg-7 col-md-12 col-sm-12">
          {/* Pass setKeyword prop to SearchBox */}
          <SearchBox keyword={keyword} setKeyword={setKeyword} />
        </div>

        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          {/* Pass setLocation prop to LocationBox */}
          <LocationBox location={location} setLocation={setLocation} />
        </div>

        <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
          <button type="submit" className="theme-btn btn-style-one" onClick={handleSubmit}>
            Tìm kiếm
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobSearchForm;
