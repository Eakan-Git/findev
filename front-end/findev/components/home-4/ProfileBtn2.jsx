import { useSelector } from "react-redux";
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../app/actions/userActions";
import { useEffect, useState } from "react";
import { fetchProfile } from "./fetchProfile";
import { fetchNotification } from "./fetchNotification";
const ProfileBtn = ({ textColor }) => {
  const { user } = useSelector((state) => state.user);
  // console.log(user);
  const [profile, setProfile] = useState(null);
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
    if (fetchedProfile?.error === false) {
      setProfile(fetchedProfile.data.user_profile);
    }
  };

  useEffect(() => {
    if (user !== null) {
      fetchNoti();
      fetchUser();
    }
  }, []);
  // console.log(user);
  // console.log(notifications);
  const router = useRouter();
  // handle signout
  const dispatch = useDispatch();
  // handle signout
  const handleSignOut = () => {
    if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
      // check if current page is start with /profile
      // console.log(router.pathname);
      if (router.pathname.startsWith("/profile")) {
        dispatch(logoutUser());
        router.push("/");
        // console.log("sign out and redirect to home page");
      } else {
        dispatch(logoutUser());
        // console.log("sign out and stay on current page");
      }
    }
  };
  const handleBtnClick = (id) => {
    if (id === 8) {
      handleSignOut();
    }
  };
  return (
    <>
      {user === null || user === undefined ? (
        <div className="outer-box">
          <div className="d-flex align-items-center btn-box2">
            <a
              href="#"
              className="theme-btn btn-style-one call-modal"
              data-bs-toggle="modal"
              data-bs-target="#loginPopupModal"
            >
              Đăng nhập
            </a>
            <Link
              href="https://findev-employer.netlify.app/"
              className="theme-btn btn-style-three"
            >
              Đăng tin tuyển dụng
            </Link>
          </div>
        </div>
      ) : (
        //<span className="text-white">{user?.userAccount.username}</span>
        // <DashboardCandidatesHeader />
        <>
          <div className="outer-box">
            {/* <button className="menu-btn">
                            <span className="count">1</span>
                                <span className="flaticon-bookmark"></span>
                        </button> */}
            {/* wishlisted menu */}

            <button className="menu-btn">
            <span className="icon la la-bell"
            style={{ color: textColor }}
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
                <img
                  alt="avatar"
                  className="thumb"
                  src={profile?.avatar || "/images/resource/candidate-1.png"}
                />
                <span className="name" style={{ color: textColor }}>
                  Hồ sơ
                </span>
              </a>

              <ul className="dropdown-menu">
                {candidatesMenuData.map((item) => (
                  <li
                    onClick={() => handleBtnClick(item.id)}
                    className={`${
                      isActiveLink(item.routePath, router.asPath)
                        ? "active"
                        : ""
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
        </>
      )}
    </>
  );
};
export default ProfileBtn;
