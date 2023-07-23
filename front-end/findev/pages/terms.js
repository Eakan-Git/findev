import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import Terms from "../components/pages-menu/terms";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Terms" />
      <Terms/>
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
