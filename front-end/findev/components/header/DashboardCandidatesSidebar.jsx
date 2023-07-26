import Link from "next/link";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import candidatesMenuData from "../../data/candidatesMenuData";
import { isActiveLink } from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useDispatch, useSelector } from "react-redux";
import { menuToggle } from "../../features/toggle/toggleSlice";
import { logoutUser } from "../../app/actions/userActions";

const DashboardCandidatesSidebar = () => {
    const { menu } = useSelector((state) => state.toggle);
    const percentage = 30;
    const router = useRouter();

    const dispatch = useDispatch();
    // menu togggle handler
    const menuToggleHandler = () => {
        dispatch(menuToggle());
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
    return (
        <div className={`user-sidebar ${menu ? "sidebar_open" : ""}`}>
            {/* Start sidebar close icon */}
            <div className="pro-header text-end pb-0 mb-0 show-1023">
                <div className="fix-icon" onClick={menuToggleHandler}>
                    <span className="flaticon-close"></span>
                </div>
            </div>
            {/* End sidebar close icon */}

            <div className="sidebar-inner">
            <ul className="navigation">
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
                {/* End navigation */}

                <div className="skills-percentage">
                    {/* <h4>Skills Percentage</h4> */}
                    <p>
                        Một ảnh đại diện tốt sẽ giúp bạn tăng cơ hội được tuyển.
                    </p>
                    {/* <div style={{ width: 200, height: 200, margin: "auto" }}>
                        <CircularProgressbar
                            background
                            backgroundPadding={6}
                            styles={buildStyles({
                                backgroundColor: "#7367F0",
                                textColor: "#fff",
                                pathColor: "#fff",
                                trailColor: "transparent",
                            })}
                            value={percentage}
                            text={`${percentage}%`}
                        />
                    </div>{" "} */}
                    {/* <!-- Pie Graph --> */}
                </div>
            </div>
        </div>
    );
};

export default DashboardCandidatesSidebar;
