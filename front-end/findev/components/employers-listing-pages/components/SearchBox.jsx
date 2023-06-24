import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setClearAllFlag } from "../../../features/filter/employerFilterSlice";

const SearchBox = ({ keyword, onKeywordChange, clearAllFlag }) => {
  const dispatch = useDispatch();
  const [inputValue, setInputValue] = useState(keyword);

  useEffect(() => {
    setInputValue(keyword);
  }, [keyword]);

  useEffect(() => {
    if (clearAllFlag) {
      setInputValue("");
      dispatch(setClearAllFlag(false));
    }
  }, [clearAllFlag, dispatch]);

  const keywordHandler = (e) => {
    setInputValue(e.target.value);
    onKeywordChange(e.target.value);
  };

  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Tên công ty"
        value={inputValue}
        onChange={keywordHandler}
      />
      <span className="icon flaticon-search-3"></span>
    </>
  );
};

export default SearchBox;
