import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import candidatesMenuData from "../../data/candidatesMenuData";
import HeaderNavContent from "./HeaderNavContent";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { fetchProfile } from "./fetchProfile";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../app/actions/userActions";
import { fetchNotification } from "../home-4/fetchNotification";
const DashboardCandidatesHeader = () => {
    const { user } = useSelector((state) => state.user);
    const [navbar, setNavbar] = useState(false);
    const [profile, setProfile] = useState(null);
    const dispatch = useDispatch();
    const [notifications, setNotifications] = useState(null);
    // get notifications data
    const fetchNoti = async () => {
        const fetchedNotifications = await fetchNotification(user?.token);
        if (fetchedNotifications?.error === false) {
            setNotifications(fetchedNotifications.data);
        }
    };
    const fetchUser = async () => {
      const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
      if (fetchedProfile.error === false) {
        setProfile(fetchedProfile.data.user_profile);
        // console.log("Profile:", fetchedProfile.data.user_profile);
        // setLoading(!loading);
      }
    };
    const handleSignOut = () => {
        //show confirm dialog to confirm sign out
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            router.push("/");
            dispatch(logoutUser());
        }
        // console.log("sign out");
      };
    const handleBtnClick = (id) => {
        if(id === 8){
            handleSignOut();
        }
    };
    useEffect(() => {
        if(user !== null)
        {
            fetchNoti();
            fetchUser();
        }
    }, []);
    const router = useRouter();

    const changeBackground = () => {
        if (window.scrollY >= 0) {
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
            className={`main-header header-shaddow  ${
                navbar ? "fixed-header " : ""
            }`}
        >
            <div className="container-fluid">
                {/* <!-- Main box --> */}
                <div className="main-box">
                    {/* <!--Nav Outer --> */}
                    <div className="nav-outer">
                        <div className="logo-box">
                            <div className="logo">
                                <Link href="/">
                                    <Image
                                        alt="brand"
                                        src="/images/logo.svg"
                                        width={154}
                                        height={50}
                                        priority
                                    />
                                </Link>
                            </div>
                        </div>
                        {/* End .logo-box */}

                        <HeaderNavContent />
                        {/* <!-- Main Menu End--> */}
                    </div>
                    {/* End .nav-outer */}

                    <div className="outer-box">
                        {/* <button className="menu-btn">
                            <span className="count">1</span>
                            <span className="icon la la-heart-o"></span>
                        </button> */}
                        {/* wishlisted menu */}

                        <button className="menu-btn">
                        <span className="icon la la-bell"
                            onClick={() => router.push("/profile/notifications")}
                            >
                            {notifications?.notifications?.total > 0 ? (
                                <span className="count">{notifications?.notifications?.total}</span>
                            ) : null}
                            </span>
                        </button>
                        {/* End notification-icon */}

                        {/* <!-- Dashboard Option --> */}
                        <div className="dropdown dashboard-option">
                            <a
                                className="dropdown-toggle"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                <Image
                                    alt="avatar"
                                    className="thumb"
                                    src= {profile?.avatar || "/images/resource/candidate-1.png"}
                                    width={90}
                                    height={90}
                                />
                                <span className="name">Hồ sơ</span>
                            </a>

                            <ul className="dropdown-menu">
                            {candidatesMenuData.map((item) => (
                                <li
                                    onClick={() => handleBtnClick(item.id)}
                                    className={`${
                                    isActiveLink(item.routePath, router.asPath) ? "active" : ""
                                    } mb-1`}
                                    key={item.id}
                                >
                                    <Link href={item.routePath}>
                                        <i className={`la ${item.icon}`}></i> {item.name}
                                    </Link>
                                </li>
                                ))}

                            </ul>
                        </div>
                        {/* End dropdown */}
                    </div>
                    {/* End outer-box */}
                </div>
            </div>
        </header>
    );
};

export default DashboardCandidatesHeader;
