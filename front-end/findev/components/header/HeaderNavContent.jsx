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
                    {/* current dropdown */}
                    <li
                        className={`${
                            isActiveParent(homeItems, router.asPath)
                                ? "current"
                                : ""
                        }`}
                    >
                        <Link href="/">
                                    Trang chủ
                                </Link>
                        {/* <div className="mega-menu">
                            <div className="mega-menu-bar row pt-0">
                                {homeItems.map((item) => (
                                    <div
                                        className="column col-lg-3 col-md-3 col-sm-12"
                                        key={item.id}
                                    >
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
                    {/* End homepage menu items */}

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
                                        className="column col-lg-3 col-md-3 col-sm-12"
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

                    {/* <li
                        className={`${
                            isActiveParent(employerItems, router.asPath) ||
                            router.asPath === "/employers-dashboard/dashboard"
                                ? "current"
                                : ""
                        } dropdown`}
                    >
                        <span>Employers</span>
                        <ul>
                            {employerItems.map((item) => (
                                <li className="dropdown" key={item.id}>
                                    <span
                                        className={
                                            isActiveParentChaild(
                                                item.items,
                                                router.asPath
                                            )
                                                ? "current"
                                                : ""
                                        }
                                    >
                                        {item.title}
                                    </span>
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
                                </li>
                            ))}
                            <li
                                className={
                                    isActiveLink(
                                        "/employers-dashboard/dashboard",
                                        router.asPath
                                    )
                                        ? "current"
                                        : ""
                                }
                            >
                                <Link href="/employers-dashboard/dashboard">
                                    Employers Dashboard
                                </Link>
                            </li>
                        </ul>
                    </li> */}
                    {/* End Employers menu items */}

                    {/* <li
                        className={`${
                            isActiveParent(candidateItems, router.asPath) ||
                            router.asPath === "/candidates-dashboard/dashboard"
                                ? "current"
                                : ""
                                ? "current"
                                : ""
                        } dropdown`}
                    >
                        <span>Candidates</span>
                        <ul>
                            {candidateItems.map((item) => (
                                <li className="dropdown" key={item.id}>
                                    <span
                                        className={
                                            isActiveParentChaild(
                                                item.items,
                                                router.asPath
                                            )
                                                ? "current"
                                                : ""
                                        }
                                    >
                                        {item.title}
                                    </span>
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
                                </li>
                            ))}
                            <li
                                className={
                                    router.asPath ===
                                    "/candidates-dashboard/dashboard"
                                        ? "current"
                                        : ""
                                }
                            >
                                <Link href="/candidates-dashboard/dashboard">
                                    Candidates Dashboard
                                </Link>
                            </li>
                        </ul>
                    </li> */}
                    {/* End Candidates menu items */}

                    {/* <li
                        className={`${
                            isActiveParentChaild(blogItems, router.asPath)
                                ? "current"
                                : ""
                        } dropdown`}
                    >
                        <span>Blog</span>
                        <ul>
                            {blogItems.map((item, i) => (
                                <li
                                    className={
                                        isActiveLink(
                                            item.routePath,
                                            router.asPath
                                        )
                                            ? "current"
                                            : ""
                                    }
                                    key={i}
                                >
                                    <Link href={item.routePath}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li> */}
                    {/* End Blog menu items */}

                    {/* <li
                        className={`${
                            isActiveParentChaild(pageItems, router.asPath) ||
                            isActiveParentChaild(
                                shopItems[0].items,
                                router.asPath
                            )
                                ? "current "
                                : ""
                        } dropdown`}
                    >
                        <span>Pages</span>
                        <ul>
                            {shopItems.map((item) => (
                                <li className="dropdown" key={item.id}>
                                    <span
                                        className={`${
                                            isActiveParentChaild(
                                                shopItems[0].items,
                                                router.asPath
                                            )
                                                ? "current "
                                                : ""
                                        }`}
                                    >
                                        {item.title}
                                    </span>
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
                                </li>
                            ))}
                            {pageItems.map((item, i) => (
                                <li
                                    className={
                                        isActiveLink(
                                            item.routePath,
                                            router.asPath
                                        )
                                            ? "current"
                                            : ""
                                    }
                                    key={i}
                                >
                                    <Link href={item.routePath}>
                                        {item.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </li> */}

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
                        <Link href="/forum">Diễn đàn CV</Link>
                    </li>
                    <li>
                        <Link href="/about">Giới thiệu</Link>
                    </li>
                    <li>
                        <Link href="/contact">Liên hệ</Link>
                    </li>
                    {/* End Pages menu items */}
                </ul>
            </nav>
        </>
    );
};

export default HeaderNavContent;
