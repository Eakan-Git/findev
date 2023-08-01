import { useRouter } from "next/router";

const SearchBox = ({ setNewTitle }) => {
  const router = useRouter();
  const currentTitle = router.query.title;
  const titleHandler = (e) => {
    e.preventDefault();
    setNewTitle(e.target.value);
  };
  return (
    <>
      <input
        type="text"
        name="listing-search"
        placeholder="Tên công việc, kỹ năng hoặc công ty..."
        // value={title}
        defaultValue={currentTitle}
        onChange={titleHandler}
      />
      <span className="icon flaticon-search-3"></span>
    </>
  );
};

export default SearchBox;
