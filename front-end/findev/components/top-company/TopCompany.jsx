import topCompany from "../../data/topCompany";
import Slider from "react-slick";
import Link from "next/link";
import { useEffect, useState } from "react";
import { localUrl } from "/utils/path.js";
const TopCompany = () => {
  const [topCompaies, setTopCompanies] = useState(null);
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
      const res = await fetch(`${localUrl}/company-profiles`);
      const data = await res.json();
      setTopCompanies(data.data.company_profiles.data);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getTopComs();
  }, []);
  return (
    <Slider {...settings} arrows={false}>
      {topCompaies?.slice(0, 6).map((company) => (
        <div className="company-block" key={company?.id}>
          <div className="inner-box">
            <figure className="image">
              <img src={company?.logo} alt="top company" />
            </figure>
            <h4 className="name">
              <Link href={`employer/${company?.id}`}>
                {company?.name.length > 20 ? company?.name.slice(0, 20) + "..." : company?.name}
              </Link>
            </h4>
            <div className="location"
            title={company?.address}
            >
              <i className="flaticon-map-locator"></i> 
              {company?.address 
              && company?.address.split(',').length > 1 
              && company?.address.split(',').slice(-2).join(',').length > 30 ? company?.address.split(',').slice(-2).join(',').slice(0, 30) + "..." : company?.address
               ? company.address.split(',').slice(-2).join(',') : company?.address}

            </div>
            <Link
              href={`employer/${company.id}`}
              className="theme-btn btn-style-three"
            >
              Xem ngay
            </Link>
          </div>
        </div>
      ))}
    </Slider>
  );
};

export default TopCompany;
