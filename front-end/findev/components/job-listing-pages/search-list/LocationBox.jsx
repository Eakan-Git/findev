import {useRouter} from "next/router";

const LocationBox = ({ setNewLocation }) => {
  const router = useRouter();
  const currentLocation = router.query.location;
  const locationHandler = (e) => {
    e.preventDefault();
    setNewLocation(e.target.value);
  }
  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Thành phố"
        // value={location}
        defaultValue={currentLocation}
        onChange={locationHandler}
      />
      <span className="icon flaticon-map-locator"></span>
    </>
  );
};

export default LocationBox;
