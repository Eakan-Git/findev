import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Contact from "../components/pages-menu/contact";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Contact" />
      <Contact />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
