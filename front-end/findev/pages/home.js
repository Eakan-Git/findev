import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Home from "../components/home-4";

const Index = () => {
    return (
        <>
            <Seo pageTitle="Trang chủ" />
            <Home />
        </>
    );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
