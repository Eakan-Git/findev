import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addLocation } from "../../../features/filter/filterSlice";
import { useRouter } from "next/router";
const LocationBox = () => {
    const router = useRouter();
    const { keyword, addresses } = router.query;
    const { jobList } = useSelector((state) => state.filter);
    const [getLocation, setLocation] = useState(jobList.location);
    const dispath = useDispatch();

    // location handler
    const locationHandler = (e) => {
        dispath(addLocation(e.target.value));
    };

    useEffect(() => {
        setLocation(jobList.location);
    }, [setLocation, jobList]);

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Thành phố"
                defaultValue={addresses}
                onChange={locationHandler}
            />
            <span className="icon flaticon-map-locator"></span>
        </>
    );
};

export default LocationBox;
