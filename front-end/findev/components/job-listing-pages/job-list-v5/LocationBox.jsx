import { useEffect } from "react";
import { useRouter } from "next/router";

const LocationBox = ({ location, setLocation }) => {
  const router = useRouter();
  const currentLocation = router.query.addresses || "";

  // Set the initial value of 'location' using the parent component's state
  useEffect(() => {
    setLocation(currentLocation === "undefined" ? "" : currentLocation);
  }, [currentLocation, setLocation]);

  // location handler
  const locationHandler = (e) => {
    setLocation(e.target.value === "undefined" ? "" : e.target.value);
  };

  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Thành phố"
        value={location}
        defaultValue={currentLocation}
        onChange={locationHandler}
      />
      <span className="icon flaticon-map-locator"></span>
    </>
  );
};

export default LocationBox;
