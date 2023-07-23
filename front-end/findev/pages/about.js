import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import About from "../components/pages-menu/about";

const Index = () => {
  return (
    <>
      <Seo pageTitle="About" />
      <About />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
