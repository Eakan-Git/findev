import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
// import { addKeyword } from "../../../features/filter/filterSlice";
import { useRouter } from "next/router";
const SearchBox = () => {
    const router = useRouter();
    const { keyword, location } = router.query;
    // console.log(keyword, location);

    const { jobList } = useSelector((state) => state.filter);
    const [getKeyWord, setkeyWord] = useState(jobList.keyword);
    const dispath = useDispatch();

    // keyword handler
    const keywordHandler = (e) => {
        
    };

    useEffect(() => {
        setkeyWord(jobList.keyword);
    }, [setkeyWord, jobList]);

    return (
        <>
            <input
                type="text"
                name="listing-search"
                placeholder="Tên công việc, kỹ năng hoặc công ty..."
                value={keyword}
                onChange={keywordHandler}
            />
            <span className="icon flaticon-search-3"></span>
        </>
    );
};

export default SearchBox;
