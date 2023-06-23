import Link from "next/link";
import companyData from "../../../data/topCompany";
import { useState, useEffect } from "react";
import Pagination from "../components/Pagination";
import { useDispatch, useSelector } from "react-redux";
import {localUrl} from "../../../utils/path.js"
import axios from "axios";
import {
    addCategory,
    addDestination,
    addFoundationDate,
    addKeyword,
    addLocation,
    addPerPage,
    addSort,
} from "../../../features/filter/employerFilterSlice";

const FilterTopBox = () => {
    const [companies, setCompanies] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [paginationLinks ,setPaginationLinks ] = useState([]);
    const [lastPage, setLastPage] = useState(0);
    const {
        keyword,
        location,
        destination,
        category,
        foundationDate,
        sort,
        perPage,
    } = useSelector((state) => state.employerFilter) || {};

    useEffect(() => {
        const getCompanies = async () => {
            try {
                const res = await axios.get(`${localUrl}/company-profiles?count_per_page=${perPage.end}&page=${currentPage}`);
                setCompanies(res.data.data.company_profiles.data);
                setPaginationLinks(res.data.data.company_profiles.links)
                setLastPage(res.data.data.company_profiles.last_page);
            } catch (err) {
                console.log(err);
            }
        };

        getCompanies();
    }, [currentPage, perPage]);

    const handlePageChange = (page) => {
        if (typeof page === "number") {
          setCurrentPage(page);
        } else if (page === "&laquo; Previous" && currentPage > 1) {
          setCurrentPage((prevPage) => prevPage - 1);
        } else if (page === "Next &raquo;" && currentPage < lastPage) {
          setCurrentPage((prevPage) => prevPage + 1);
        } else {
          const clickedPage = parseInt(page);
          if (!isNaN(clickedPage) && clickedPage !== currentPage) {
            setCurrentPage(clickedPage);
          }
        }
      };

    const dispatch = useDispatch();

    // keyword filter
    const keywordFilter = (item) =>
        keyword !== ""
            ? item?.name?.toLowerCase().includes(keyword?.toLowerCase()) && item
            : item;

    // location filter
    const locationFilter = (item) =>
        location !== ""
            ? item?.location?.toLowerCase().includes(location?.toLowerCase())
            : item;

    // destination filter
    const destinationFilter = (item) =>
        item?.destination?.min >= destination?.min &&
        item?.destination?.max <= destination?.max;

    // category filter
    const categoryFilter = (item) =>
        category !== ""
            ? item?.category?.toLocaleLowerCase() ===
              category?.toLocaleLowerCase()
            : item;

    // foundation date filter
    const foundationDataFilter = (item) =>
        item?.foundationDate?.min >= foundationDate?.min &&
        item?.foundationDate?.max <= foundationDate?.max;

    // sort filter
    const sortFilter = (a, b) =>
        sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1;

    let content = null;
        // ?.slice(perPage.start !== 0 && 12, perPage.end !== 0 ? perPage.end : 24)
        // ?.filter(keywordFilter)
        // ?.filter(locationFilter)
        // ?.filter(destinationFilter)
        // ?.filter(categoryFilter)
        // ?.filter(foundationDataFilter)
        // ?.sort(sortFilter)
        if(companies !== null && companies !== undefined){
            if(companies.length > 0){
                const filteredCompanies = companies.sort(sortFilter);
                content = filteredCompanies.map((company) => (
            <div
                className="company-block-four col-xl-3 col-lg-6 col-md-6 col-sm-12"
                key={company.id}
            >
                <div className="inner-box">
                    {/* <button className="bookmark-btn">
                        <span className="flaticon-bookmark"></span>
                    </button> */}

                    <div className="content-inner">
                        {/* <span className="featured">Đã xác thực</span> */}
                        <span className="company-logo">
                            <img src={company.logo} alt="company brand" />
                        </span>
                        <h4>
                            <Link href={`employer/${company.id}`}>
                                {company.name}
                            </Link>
                        </h4>
                        <ul className="job-info flex-column">
                            <li className="me-0">
                                <span className="icon flaticon-map-locator"></span>
                                {company.address.split(",").pop().trim()}
                            </li>
                            <li className="me-0">
                                <span className="icon flaticon-briefcase"></span>
                                {company?.jobType || "Toàn thời gian"}
                            </li>
                        </ul>
                    </div>

                    <div className="job-type me-0">
                        Công việc đang tuyển – {company?.jobNumber || Math.floor(Math.random() * 10)}
                    </div>
                </div>
            </div>
            ));
        } else {
            content = <h1>Không tìm thấy công ty</h1>;
        }
    }
    // per page handler
    const perPageHandler = (e) => {
        const pageData = JSON.parse(e.target.value);
        dispatch(addPerPage(pageData));
        setCurrentPage(1);
    };

    // sort handler
    const sortHandler = (e) => {
        dispatch(addSort(e.target.value));
    };

    // clear handler
    const clearAll = () => {
        dispatch(addKeyword(""));
        dispatch(addLocation(""));
        dispatch(addDestination({ min: 0, max: 100 }));
        dispatch(addCategory(""));
        dispatch(addFoundationDate({ min: 1900, max: 2028 }));
        dispatch(addSort(""));
        dispatch(addPerPage({ start: 0, end: 8 }));
    };
    return (
        <>
            <div className="ls-switcher">
                <div className="showing-result">
                    <div className="text">
                        <strong>{content?.length}</strong> công ty
                    </div>
                </div>
                {/* End showing-result */}
                <div className="sort-by">
                    {keyword !== "" ||
                    location !== "" ||
                    destination.min !== 0 ||
                    destination.max !== 100 ||
                    category !== "" ||
                    foundationDate.min !== 1900 ||
                    foundationDate.max !== 2028 ||
                    sort !== "" ||
                    perPage.start !== 0 ||
                    perPage.end !== 8 ? (
                        <button
                            onClick={clearAll}
                            className="btn btn-danger text-nowrap me-2"
                            style={{
                                minHeight: "45px",
                                marginBottom: "15px",
                            }}
                        >
                            Xóa hết
                        </button>
                    ) : undefined}

                    <select
                        value={sort}
                        className="chosen-single form-select"
                        onChange={sortHandler}
                    >
                        <option value="">Mặc định</option>
                        <option value="asc">Mới nhất</option>
                        <option value="des">Cũ nhất</option>
                    </select>
                    {/* End select */}

                    <select
                        onChange={perPageHandler}
                        className="chosen-single form-select ms-3 "
                        value={JSON.stringify(perPage)}
                    >
                        <option
                            value={JSON.stringify({
                                start: 0,
                                end: 8,
                            })}
                        >
                            8 công ty
                        </option>
                        <option
                            value={JSON.stringify({
                                start: 0,
                                end: 12,
                            })}
                        >
                            12 công ty
                        </option>
                        <option
                            value={JSON.stringify({
                                start: 0,
                                end: 16,
                            })}
                        >
                            16 công ty
                        </option>
                        <option
                            value={JSON.stringify({
                                start: 0,
                                end: 20,
                            })}
                        >
                            20 công ty
                        </option>
                    </select>
                    {/* End select */}
                </div>
            </div>
            {/* End top filter bar box */}

            <div className="row">{content}</div>
            {/* End .row */}

           <Pagination paginationLinks={paginationLinks} handlePageChange={handlePageChange}/>
            {/* <!-- Pagination --> */}
        </>
    );
};

export default FilterTopBox;
