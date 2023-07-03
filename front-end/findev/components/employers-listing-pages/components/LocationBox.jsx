import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClearAllFlag } from "../../../features/filter/employerFilterSlice";


const LocationBox = ({ location, onLocationChange, clearAllFlag }) => {
    const dispatch = useDispatch();
    const [inputValue, setInputValue] = useState(location);
  
    useEffect(() => {
      setInputValue(location);
    }, [location]);
  
    useEffect(() => {
      if (clearAllFlag) {
        setInputValue("");
        dispatch(setClearAllFlag(false));
      }
    }, [clearAllFlag, dispatch]);
  
    const locationHandler = (e) => {
      setInputValue(e.target.value);
      onLocationChange(e.target.value);
    };
    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Thành phố"
                value={inputValue}
                onChange={locationHandler}
            />
            <span className="icon flaticon-map-locator"></span>
        </>
    );
};

export default LocationBox;
