import dynamic from "next/dynamic";
import Seo from "../components/common/Seo";
import EmployersList from "../components/employers-listing-pages/employers-list-v3";

const Index = () => {
  return (
    <>
      <Seo pageTitle="Danh sách công ty" />
      <EmployersList />
    </>
  );
};

export default dynamic(() => Promise.resolve(Index), { ssr: false });
