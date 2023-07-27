import { useEffect } from "react";
import { useRouter } from "next/router";

const SearchBox = ({keyword, setKeyword }) => {
  const router = useRouter();
  const currentKeyword = router.query.keyword || "";

  // Set the initial value of 'keyword' using the parent component's state
  useEffect(() => {
    setKeyword(currentKeyword === "undefined" ? "" : currentKeyword);
  }, [currentKeyword, setKeyword]);

  // keyword handler
  const keywordHandler = (e) => {
    setKeyword(e.target.value === "undefined" ? "" : e.target.value);
  };

  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Tên công việc, kỹ năng hoặc công ty..."
        value={keyword}
        defaultValue={currentKeyword}
        onChange={keywordHandler}
      />
      <span className="icon flaticon-search-3"></span>
    </>
  );
};

export default SearchBox;
