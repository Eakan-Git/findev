import { useSelector } from "react-redux";
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
const ProfileBtn = ({textColor}) => {
    const { user } = useSelector((state) => state.user);
    const router = useRouter();
    // handle signout
    const dispatch = useDispatch();
    // handle signout
    const handleSignOut = () => {
        // dispatch(LOGOUT());
        router.push("/");
    };
    return (
        <>
        {user === null ? (
            <div className="outer-box">
              <div className="d-flex align-items-center btn-box2">
                <a
                  href="#"
                  className="theme-btn btn-style-five call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Đăng nhập
                </a>
                <Link
                  href="/employers-dashboard/post-jobs"
                  className="theme-btn btn-style-six"
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

                        {/* <button className="menu-btn">
                            <span className="icon la la-bell"></span>
                        </button> */}
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
                                    src="/images/resource/candidate-1.png"
                                    width={30}
                                    height={30}
                                />
                                <span className="name" style={{color: textColor}}>Hồ sơ</span>
                            </a>

                            <ul className="dropdown-menu">
                                {candidatesMenuData.slice(0, -1).map((item) => (
                                    <li
                                        className={`${
                                            isActiveLink(
                                                item.routePath,
                                                router.asPath
                                            )
                                                ? "active"
                                                : ""
                                        } mb-1`}
                                        key={item.id}
                                    >
                                        {/* check if routePath is signout to handle */}
                                        {item.routePath === "/signout" ? (
                                            // add onClick event to handle signout
                                            <a
                                                onClick={handleSignOut()}
                                            >
                                                <i
                                                    className={`la ${item.icon}`}
                                                ></i>{" "}
                                                {item.name}
                                            </a>
                                        ) : (
                                            <Link href={item.routePath}>
                                            <i
                                                className={`la ${item.icon}`}
                                            ></i>{" "}
                                            {item.name}
                                        </Link>
                                        )}
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
}
export default ProfileBtn;