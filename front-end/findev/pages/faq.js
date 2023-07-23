import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Faq from "../components/pages-menu/faq";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Faq" />
      <Faq />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
