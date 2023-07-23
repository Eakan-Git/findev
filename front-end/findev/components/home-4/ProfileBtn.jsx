import { useSelector } from "react-redux";
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import Image from "next/image"
import Link from "next/link";
import { useRouter } from "next/router";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../app/actions/userActions";
import { useEffect, useState } from "react";
import { fetchProfile } from "./fetchProfile";

const ProfileBtn = ({textColor}) => {
    const { user } = useSelector((state) => state.user);
    const [profile, setProfile] = useState(false);
    // get profile data
    const fetchUser = async () => {
      const fetchedProfile = await fetchProfile(user.userAccount.id, user.token);
      if (fetchedProfile?.error === false) {
        setProfile(fetchedProfile.data.user_profile);
        // console.log("Profile:", fetchedProfile.data.user_profile);
        // setLoading(!loading);
      }
      else{
        alert(fetchedProfile?.message || "Có lỗi xảy ra");
      }
    };
  
    useEffect(() => {
      if(user !== null)
      {fetchUser();}
    }, []);
    // console.log(user);
    const router = useRouter();
    // handle signout
    const dispatch = useDispatch();
    // handle signout
    const handleSignOut = () => {
        //show confirm dialog to confirm sign out
        if (confirm("Bạn có chắc chắn muốn đăng xuất?")) {
            dispatch(logoutUser());
            router.push("/");
        }
        // console.log("sign out");
      };
    const handleBtnClick = (id) => {
        if(id === 8){
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
                  className="theme-btn btn-style-five call-modal"
                  data-bs-toggle="modal"
                  data-bs-target="#loginPopupModal"
                >
                  Đăng nhập
                </a>
                <Link
                  href="#"
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
                                    src= {profile?.avatar || "/images/resource/candidate-1.png"}
                                    width={90}
                                    height={90}
                                />
                                <span className="name" style={{color: textColor}}>Hồ sơ</span>
                            </a>

                            <ul className="dropdown-menu">
                            {candidatesMenuData.slice(0, -1).map((item) => (
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
           </>
          )}
        </>
    );
}
export default ProfileBtn;