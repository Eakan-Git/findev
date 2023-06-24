import { useState, useEffect  } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addKeyword, addLocation, setClearAllFlag } from "../../../features/filter/employerFilterSlice";
import LocationBox from "../components/LocationBox";
import SearchBox from "../components/SearchBox";

const CompanySearchForm = () => {
    const dispatch = useDispatch();
    const { keyword, location, clearAllFlag  } = useSelector((state) => state.employerFilter);
    const [updatedKeyword, setUpdatedKeyword] = useState(keyword);
    const [updatedLocation, setUpdatedLocation] = useState(location);

    // keyword handler
    const keywordHandler = (value) => {
        setUpdatedKeyword(value);
    };

    // location handler
    const locationHandler = (value) => {
        setUpdatedLocation(value);
    };

    // search button handler
    const searchHandler = () => {
        dispatch(addKeyword(updatedKeyword));
        dispatch(addLocation(updatedLocation));
    };

    return (
        <>
            <div className="job-search-form">
                <div className="row">
                    <div className="form-group col-lg-7 col-md-12 col-sm-1">
                        <SearchBox keyword={updatedKeyword} onKeywordChange={keywordHandler} clearAllFlag={clearAllFlag}/>
                    </div>
            
                    <div className="form-group col-lg-3 col-md-12 col-sm-12 location">
                        <LocationBox location={updatedLocation} onLocationChange={locationHandler} clearAllFlag={clearAllFlag}/>
                    </div>
            
                    <div className="form-group col-lg-2 col-md-12 col-sm-12 text-right">
                        <button type="submit" className="theme-btn btn-style-one" onClick={searchHandler}>
                            Tìm kiếm
                        </button>
                    </div>
                </div>
            </div>    
        </>
    );
};

export default CompanySearchForm;
