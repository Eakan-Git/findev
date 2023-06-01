import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    addCategory,
    addDatePosted,
    addExperienceSelect,
    addJobTypeSelect,
    addKeyword,
    addLocation,
    addPerPage,
    addSalary,
    addSort,
} from "../../../features/filter/filterSlice";
import Pagination from "../components/Pagination";
import JobSelect from "../components/JobSelect";

const FilterJobBox = () => {
    const [jobs, setJobs] = useState(null);

    useEffect(() => {
        const getJobs = async () => {
            try {
                const res = await fetch("http://localhost:8000/api/jobs?page=1&count_per_page=10");
                const resData = await res.json();
                setJobs(resData.data.jobs);
                console.log(resData);
            } catch (err) {
                console.log(err);
            }
        };

        getJobs();
    }, []);

    const { jobList, jobSort } = useSelector((state) => state.filter);
    const {
        keyword,
        location,
        destination,
        category,
        datePosted,
        jobTypeSelect,
        experienceSelect,
        salary,
    } = jobList || {};

    const { sort, perPage } = jobSort;
    const dispatch = useDispatch();

    // Filters
    const keywordFilter = (item) =>
        keyword !== "" ? item.jobTitle.toLowerCase().includes(keyword.toLowerCase()) : item;

    const locationFilter = (item) =>
        location !== "" ? item?.location?.toLowerCase().includes(location.toLowerCase()) : item;

    const destinationFilter = (item) =>
        item?.destination?.min >= destination?.min && item?.destination?.max <= destination?.max;

    const categoryFilter = (item) =>
        category !== "" ? item?.category?.toLowerCase() === category.toLowerCase() : item;

    const jobTypeFilter = (item) =>
        item.jobType !== undefined &&
        jobTypeSelect !== "" &&
        item?.jobType[0]?.type.toLowerCase().split(" ").join("-") === jobTypeSelect
            ? item
            : null;

    const datePostedFilter = (item) =>
        datePosted !== "all" &&
        datePosted !== "" &&
        item?.created_at.toLowerCase().split(" ").join("-").includes(datePosted)
            ? item
            : null;

    const experienceFilter = (item) =>
        experienceSelect !== "" &&
        item?.experience.split(" ").join("-").toLowerCase() === experienceSelect
            ? item
            : null;

    const salaryFilter = (item) =>
        item?.totalSalary?.min >= salary?.min && item?.totalSalary?.max <= salary?.max;

    const sortFilter = (a, b) => (sort === "des" ? a.id > b.id && -1 : a.id < b.id && -1);

    // Jobs content
    let content = null;

    if (jobs !== null && jobs !== undefined) {
        const filteredJobs = jobs.data;
            // .filter(keywordFilter)
            // .filter(locationFilter)
            // .filter(destinationFilter)
            // .filter(categoryFilter)
            // .filter(jobTypeFilter)
            // .filter(datePostedFilter)
            // .filter(experienceFilter)
            // .filter(salaryFilter)
            // .sort(sortFilter)
            // .slice(perPage.start, perPage.end !== 0 ? perPage.end : 16);

        if (filteredJobs.length > 0) {
            content = filteredJobs.map((item) => (
                <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
                    <div className="inner-box">
                        <div className="content">
                            <span className="company-logo">
                                <Link href={`/job/${item.id}`}>
                                <img src="https://via.placeholder.com/90" 
                                title={item.employer_profile.company_profile.name} 
                                alt={item.employer_profile.company_profile.name}
                                />
                                </Link>
                                {/* <img src={item.employer_profile.company_profile.logo} alt={item.employer_profile.company_profile.name} /> */}
                            </span>
                            <h4>
                                <Link href={`/job/${item.id}`}
                                alt={item.title}
                                title={item.title}
                                >
                                    {/* check if job title is longer than 50 character then truncate */}
                                        {item.title.length > 50
                                            ? item.title.slice(0, 50) + "..."
                                            : item.title
                                        }
                                </Link>
                            </h4>
                            <ul className="job-info">
                                <li>
                                    <span className="icon flaticon-briefcase"></span>
                                    {item.position}
                                </li>
                                <li>
                                    <span className="icon flaticon-map-locator"></span>
                                    {/* get first location from job_location array using slice
                                        and get text before ':' using split
                                    */}
                                    {/* {item.location[0].split(":")[0]} */}
                                    {item.job_locations.slice(0, 1)[0].location.split(":")[0]}
                                </li>
                                <li>
                                    <span className="icon flaticon-clock-3"></span> {item.deadline}
                                </li>
                                <li>
                                    <span className="icon flaticon-money"></span>
                                    {/* switch case for min_salary and max_salary cases:
                                    min_salary = -1 and max_salary = -1 => Thỏa thuận
                                    min_salary = 0 and max_salary = 0 => Không lương
                                    min_salary = 0 and max_salary > 0 => Lên đến max_salary
                                    min_salary > 0 and max_salary > 0 => Từ min_salary - max_salary
                                    */}
                                    {item.min_salary === -1 && item.max_salary === -1
                                        ? "Thỏa thuận"
                                        : item.min_salary === 0 && item.max_salary === 0
                                        ? "Không lương"
                                        : item.min_salary === 0 && item.max_salary > 0
                                        ? `Lên đến ${item.max_salary} triệu`
                                        : `${item.min_salary} - ${item.max_salary} triệu`}
                                </li>
                            </ul>
                            <ul className="job-other-info">
                                {item?.jobType?.map((val, i) => (
                                    <li key={i} className={`${val.styleClass}`}>
                                        {val.type}
                                    </li>
                                ))}
                            </ul>
                            <button className="bookmark-btn">
                                <span className="flaticon-bookmark"></span>
                            </button>
                        </div>
                    </div>
                </div>
            ));
        } else {
            content = <h1>Không tìm thấy công việc</h1>;
        }
    }

    // Event Handlers
    const sortHandler = (e) => {
        dispatch(addSort(e.target.value));
    };

    const perPageHandler = (e) => {
        const pageData = JSON.parse(e.target.value);
        dispatch(addPerPage(pageData));
    };

    const clearAll = () => {
        dispatch(addKeyword(""));
        dispatch(addLocation(""));
        dispatch(addCategory(""));
        dispatch(addJobTypeSelect(""));
        dispatch(addDatePosted(""));
        dispatch(addExperienceSelect(""));
        dispatch(addSalary({ min: 0, max: 20000 }));
        dispatch(addSort(""));
        dispatch(addPerPage({ start: 0, end: 0 }));
    };

    return (
        <>
            <div className="ls-switcher">
                <JobSelect />

                <div className="sort-by">
                    {keyword !== "" ||
                    location !== "" ||
                    category !== "" ||
                    jobTypeSelect !== "" ||
                    datePosted !== "" ||
                    experienceSelect !== "" ||
                    salary?.min !== 0 ||
                    salary?.max !== 20000 ||
                    sort !== "" ||
                    perPage.start !== 0 ||
                    perPage.end !== 0 ? (
                        <button
                            onClick={clearAll}
                            className="btn btn-danger text-nowrap me-2"
                            style={{ minHeight: "45px", marginBottom: "15px" }}
                        >
                            Clear All
                        </button>
                    ) : null}

                    <select
                        value={sort}
                        className="chosen-single form-select"
                        onChange={sortHandler}
                    >
                        <option value="">Sắp xếp theo</option>
                        <option value="asc">Mới nhất</option>
                        <option value="des">Cũ nhất</option>
                    </select>

                    <select
                        onChange={perPageHandler}
                        className="chosen-single form-select ms-3 "
                        value={JSON.stringify(perPage)}
                    >
                        <option value={JSON.stringify({ start: 0, end: 0 })}>Tất cả</option>
                        <option value={JSON.stringify({ start: 0, end: 10 })}>10 mỗi trang</option>
                        <option value={JSON.stringify({ start: 0, end: 20 })}>20 mỗi trang</option>
                        <option value={JSON.stringify({ start: 0, end: 30 })}>30 mỗi trang</option>
                    </select>
                </div>
            </div>

            <div className="row">{content}</div>

            <Pagination />
        </>
    );
};

export default FilterJobBox;
