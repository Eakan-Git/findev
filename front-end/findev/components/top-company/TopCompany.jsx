import topCompany from "../../data/topCompany";
import Slider from "react-slick";
import Link from "next/link";
import { useEffect, useState } from "react";
import axios from 'axios'
import { localUrl } from "/utils/path.js";
const TopCompany = () => {
  const [topCompaies, setTopCompanies] = useState([]);
  const settings = {
    dots: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 4,
    autoplay: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  const getTopComs = async () => {
    try {
      const res = await axios.get(`${localUrl}/user-educations/user/${user.userAccount.id}`, 
      {
        headers: 
        {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        }})
      setTopCompanies(res.data.data.user_educations.data);
    } catch (error) {
      if(error.response.data.message === "Không tìm thấy")
        setEducations([])
    }
  }

  return (
    <Slider {...settings} arrows={false}>
      {topCompany.slice(0, 12).map((company) => (
        <div className="company-block" key={company.id}>
          <div className="inner-box">
            <figure className="image">
              <img src={company.img} alt="top company" />
            </figure>
            <h4 className="name">
              <Link href={`employer/${company.id}`}>
                {company.name}
              </Link>
            </h4>
            <div className="location">
              <i className="flaticon-map-locator"></i> {company.location}
            </div>
            <Link
              href={`employer/${company.id}`}
              className="theme-btn btn-style-three"
            >
              {company.jobNumber} vị trí đang tuyển
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default TopCompany;
