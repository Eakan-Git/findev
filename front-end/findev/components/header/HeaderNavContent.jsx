import Link from "next/link";
import ProfileBtn from "../home-4/ProfileBtn";
import {
    blogItems,
    candidateItems,
    employerItems,
    findJobItems,
    homeItems,
    pageItems,
    shopItems,
} from "../../data/mainMenuData";
import {
    isActiveParent,
    isActiveLink,
    isActiveParentChaild,
} from "../../utils/linkActiveChecker";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
const HeaderNavContent = () => {
    const { user } = useSelector((state) => state.user);
    // console.log(user);
    const router = useRouter();

    return (
        <>
            <nav className="nav main-menu">
                <ul className="navigation" id="navbar">
                    <li className={`${
                        isActiveParent(homeItems, router.asPath)
                        ? "current"
                        : ""}`}>
                        <Link href="/">Trang chủ</Link>
                    </li>
                    {/* End homepage menu items */}
                    {user ? (
                        <li>
                            <Link href="/profile/cv-manager">
                            Quản lý CV
                        </Link>
                        </li>
                    ) : (
                        null)
                    }
                    <li
                        className={`${
                            isActiveParent(findJobItems, router.asPath)
                                ? "current"
                                : ""
                        } 
                        // dropdown has-mega-menu
                        `}
                        id="has-mega-menu"
                    >
                        <Link href="/find-jobs">
                                    Tìm việc
                                </Link>
                        {/* <div className="mega-menu">
                            <div className="mega-menu-bar row">
                                {findJobItems.map((item) => (
                                    <div
                                        className="column col-lg-12 col-md-12 col-sm-12"
                                        key={item.id}
                                    >
                                        <h3>{item.title}</h3>
                                        <ul>
                                            {item.items.map((menu, i) => (
                                                <li
                                                    className={
                                                        isActiveLink(
                                                            menu.routePath,
                                                            router.asPath
                                                        )
                                                            ? "current"
                                                            : ""
                                                    }
                                                    key={i}
                                                >
                                                    <Link href={menu.routePath}>
                                                        {menu.name}
                                                    </Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </div> */}
                    </li>
                    {/* End findjobs menu items */}

                    {user ? (
                        <li>
                            <Link href="/recommended-jobs">
                            Gợi ý việc làm
                        </Link>
                        </li>
                    ) : (
                        null)
                    }
                    <li>
                        <Link href="/employers">Công ty</Link>
                    </li>
                    <li>
                        <Link href="/faq">Câu hỏi thường gặp</Link>
                    </li>
                    {/* End Pages menu items */}
                </ul>
            </nav>
        </>
    );
};

export default HeaderNavContent;
