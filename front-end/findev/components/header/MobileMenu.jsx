import Link from "next/link";
import MobileSidebar from "./mobile-sidebar";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { fetchNotification } from "../home-4/fetchNotification";
import { useSelector } from "react-redux";
const MobileMenu = () => {
  const [notifications, setNotifications] = useState(null);
  const route = useRouter();
  const { user } = useSelector((state) => state.user);
  const fetchNoti = async () => {
    const fetchedNotifications = await fetchNotification(user?.token);
    if (fetchedNotifications?.error === false) {
      setNotifications(fetchedNotifications.data);
    }
  };
  useEffect(() => {
    fetchNoti();
  }, []);
  return (
    // <!-- Main Header-->
    <header className="main-header main-header-mobile">
      <div className="auto-container">
        {/* <!-- Main box --> */}
        <div className="inner-box">
          <div className="nav-outer">
            <div className="logo-box">
              <div className="logo">
                <Link href="/">
                  <img src="/images/logo.svg" alt="brand" />
                </Link>
              </div>
            </div>
            {/* End .logo-box */}

            <MobileSidebar />
            {/* <!-- Main Menu End--> */}
          </div>
          {/* End .nav-outer */}

          <div className="outer-box">
            <a>
              {/* add notification icon */}
              <span className="flaticon-notification">
                <span
                  className="count"
                  {...(notifications?.notifications?.total > 0
                    ? {
                        style: {
                          position: "absolute",
                          top: "-10px",
                          left: "10px",
                          width: "20px",
                          height: "20px",
                          borderRadius: "50%",
                          backgroundColor: "#ff214f",
                          color: "#fff",
                          fontSize: "12px",
                          fontWeight: "500",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                        },
                      }
                    : { style: { display: "none" } })}
                  onClick={() => {
                    route.push("/profile/notifications");
                  }}
                >
                  {notifications?.notifications?.total > 0 ? notifications?.notifications?.total : null}
                </span>
              </span>
            </a>
            {/* <div className="login-box">
                            <a
                                href="#"
                                className="call-modal"
                                data-bs-toggle="modal"
                                data-bs-target="#loginPopupModal"
                            >
                                <span className="icon icon-user"></span>
                            </a>
                        </div> */}
            {/* login popup end */}

            <a
              href="#"
              className="mobile-nav-toggler"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasMenu"
            >
              <span className="flaticon-menu-1"></span>
            </a>
            {/* left humberger menu */}
          </div>
        </div>
      </div>
    </header>
  );
};

export default MobileMenu;
