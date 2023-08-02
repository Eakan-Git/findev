import Link from "next/link";
import { useRouter } from "next/router";
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
import { Slider } from "@mui/material";

const FilterJobBox = ({ jobs, isLoading }) => {
  const router = useRouter();
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage, setJobsPerPage] = useState(10);
  const [type, setType] = useState(router.query.type || "");
  useEffect(() => {
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        page: currentPage,
        count_per_page: jobsPerPage,
      },
    });
  }, [currentPage, jobsPerPage]);
  const handlePageChange = (page) => {
    if (!isNaN(page)) {
      setCurrentPage(parseInt(page));
    } else if (page === "&laquo; Previous" && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else if (page === "Next &raquo;" && currentPage < jobs.last_page) {
      setCurrentPage(currentPage + 1);
    }
  };
  const typeHandler = (e) => {
    router.push({
      pathname: "/search",
      query: {
        ...router.query,
        type: e.target.value,
      },
    });
  };
  const { jobList, jobSort } = useSelector((state) => state.filter);

  const { sort, perPage } = jobSort;
  const dispatch = useDispatch();

  let content = null;

  if (jobs !== null && jobs !== undefined) {
    const filteredJobs = jobs?.data;
    if (isLoading) {
      content = (
        <>
          <h1 style={{ textAlign: "center", color: "black" }}>
            <span
              className="fa fa-spinner fa-spin fa-fw"
              style={{ marginRight: "5px" }}
            ></span>
            Đang tải...
          </h1>
          ;
        </>
      );
    } else {
      // if not loading
      // console.log(filteredJobs);
      if (filteredJobs?.length <= 0) {
        content = <h1>Không tìm thấy công việc</h1>;
      } else {
        content = filteredJobs?.map((item) => (
          <div className="job-block col-lg-6 col-md-12 col-sm-12" key={item.id}>
            <div className="inner-box">
              <div className="content">
                <span className="company-logo">
                  <Link href={`/job/${item.id}`}>
                    <img
                      src={item?.employer_profile?.company_profile?.logo}
                      // title={item.employer_profile.company_profile.name}
                      // alt={item.employer_profile.company_profile.name}
                    />
                  </Link>
                  {/* <img src={item.employer_profile.company_profile.logo} alt={item.employer_profile.company_profile.name} /> */}
                </span>
                <h4>
                  <Link
                    href={`/job/${item.id}`}
                    alt={item.title}
                    title={item.title}
                  >
                    {/* check if job title is longer than 50 character then truncate */}
                    {item?.title?.length > 50
                      ? item?.title?.slice(0, 50) + "..."
                      : item?.title}
                  </Link>
                </h4>
                <ul className="job-info">
                  <li>
                    <span className="icon flaticon-briefcase"></span>
                    <Link
                      href={`/employer/${item.employer_profile.company_profile.id}`}
                      alt={item.employer_profile.company_profile.name}
                      title={item.employer_profile.company_profile.name}
                    >
                      {item?.employer_profile?.company_profile?.name?.length >
                      12
                        ? item?.employer_profile?.company_profile.name?.slice(
                            0,
                            12
                          ) + "..."
                        : item?.employer_profile?.company_profile?.name}
                    </Link>
                  </li>
                  <li>
                    <span className="icon flaticon-map-locator"></span>
                    {/* get first location from job_location array using slice
                                            and get text before ':' using split
                                        */}
                    {/* {item.location[0].split(":")[0]} */}
                    {item?.location?.split(":")[0]}
                  </li>
                  <li>
                    <span className="icon flaticon-clock-3"></span>{" "}
                    {item.deadline}
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
                      ? `Lên đến ${item.max_salary}tr`
                      : `${item.min_salary} - ${item.max_salary}tr`}
                  </li>
                </ul>
                <ul className="job-other-info">
                  <li className="time">{item.type}</li>
                  <li className="required">Số lượng: {item.recruit_num}</li>
                  <li className="yoe">
                    {/* if item.min_yoe == item.max_yoe -> min_yoe
                                        if item.min_yoe == item.max_yoe -> min_yoe == 0 -> Không yêu cầu kinh nghiệm
                                        if item.min_yoe == item.max_yoe -> min_yoe != 0 -> Kinh nghiệm từ min_yoe năm
                                        if item.min_yoe != item.max_yoe -> Kinh nghiệm từ min_yoe đến max_yoe năm
                                    */}
                    {item?.min_yoe === item?.max_yoe
                      ? item?.min_yoe === 0
                        ? "Không yêu cầu kinh nghiệm"
                        : `Kinh nghiệm từ ${item?.min_yoe} năm`
                      : `Kinh nghiệm từ ${item?.min_yoe} - ${item?.max_yoe}
                                        năm`}
                  </li>
                </ul>
                {/* <button className="bookmark-btn">
                                    <span className="flaticon-bookmark"></span>
                                </button> */}
              </div>
            </div>
          </div>
        ));
      }
    }
  }

  // Event Handlers
  const sortHandler = (e) => {
    dispatch(addSort(e.target.value));
  };

  const perPageHandler = (e) => {
    const pageData = JSON.parse(e.target.value);
    dispatch(addPerPage(pageData));
    setJobsPerPage(pageData.end - pageData.start);
    setCurrentPage(1);
  };

  const clearAll = () => {
    dispatch(addPerPage({ count_per_page: 10 }));
    setJobsPerPage(10);
    setCurrentPage(1);
  };

  return (
    <>
      <div className="ls-switcher">
        {/* <JobSelect /> */}

        <div className="sort-by">
          {/* {perPage.end !== 10 ? (
            <button
              onClick={clearAll}
              className="btn btn-danger text-nowrap me-2"
              style={{ minHeight: "45px", marginBottom: "15px" }}
            >
              Về mặc định
            </button>
          ) : null} */}

          <select
            className="chosen-single form-select"
            onChange={typeHandler}
            defaultValue={type}
            style={{padding: "0.375rem 0.75rem", height: "45px"}}
          >
            <option value="">Loại công việc</option>
            <option value="Bán thời gian">Bán thời gian</option>
            <option value="Toàn thời gian">Toàn thời gian</option>
            <option value="Thực tập">Thực tập</option>
          </select>
          <select
            onChange={perPageHandler}
            className="chosen-single form-select ms-3 "
            value={JSON.stringify(perPage)}
          >
            <option value={JSON.stringify({ start: 0, end: 10 })}>
              10 mỗi trang
            </option>
            <option value={JSON.stringify({ start: 0, end: 20 })}>
              20 mỗi trang
            </option>
            <option value={JSON.stringify({ start: 0, end: 30 })}>
              30 mỗi trang
            </option>
            <option value={JSON.stringify({ start: 0, end: 50 })}>
              50 mỗi trang
            </option>
          </select>
        </div>
      </div>

      <div className="row">{content}</div>

      <Pagination jobs={jobs} handlePageChange={handlePageChange} />
    </>
  );
};

export default FilterJobBox;
