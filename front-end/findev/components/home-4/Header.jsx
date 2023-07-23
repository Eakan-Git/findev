import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderNavContent from "../header/HeaderNavContent";
import { useSelector } from "react-redux";
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import Image from "next/image"
import ProfileBtn from "./ProfileBtn";
const Header = () => {
  const [navbar, setNavbar] = useState(false);
  const user = useSelector((state) => state.user);
  const router = useRouter();

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
  }, []);

  return (
    // <!-- Main Header-->
    <header
      className={`main-header header-style-two alternate  ${
        navbar ? "fixed-header animated slideInDown" : ""
      }`}
    >
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="main-box">
          {/* <!--Nav Outer --> */}
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <img src="/images/logo-white.svg" alt="brand" />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <HeaderNavContent />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}
          <ProfileBtn textColor="white" />
        </div>
      </div>
    </header>
  );
};

export default Header;
