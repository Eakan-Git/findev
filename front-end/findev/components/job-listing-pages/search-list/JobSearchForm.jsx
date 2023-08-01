import LocationBox from "./LocationBox";
import SearchBox from "./SearchBox";
import { useState } from "react";
import { useRouter } from "next/router";

const JobSearchForm = ({title, location}) => {
  const router = useRouter();
  const [newTitle, setNewTitle] = useState("");
  const [newLocation, setNewLocation] = useState("");
  let currentTitle = router.query.title;
  let currentLocation = router.query.location;
  const handleSubmit = (e) => {
    e.preventDefault();
    router.push({
      pathname: "/search",
      query: {
        title: newTitle !== "" ? newTitle : currentTitle,
        location: newLocation !== "" ? newLocation : currentLocation,
      },
    });
  };

  return (
    <div className="job-search-form">
      <div className="row">
        <div className="form-group col-lg-7 col-md-12 col-sm-12">
          <SearchBox setNewTitle={setNewTitle}/>
        </div>
        <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
          <LocationBox setNewLocation={setNewLocation}/>
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
