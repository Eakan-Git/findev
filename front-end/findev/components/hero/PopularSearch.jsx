import Link from "next/link";
const PopularSearch = () => {
  return (
    <div className="popular-searches" data-aos="fade-up" data-aos-delay="1000">
      <span className="title">Tìm kiếm nhiều nhất: </span>
      <Link href="/search?keyword=Designer">Designer</Link>, <Link href="/search?keyword=Developer">Developer</Link>, <Link href="/search?keyword=Web">Web</Link>,
      <Link href="/search?keyword=IOS"> IOS</Link>, <Link href="/search?keyword=PHP">PHP</Link>, <Link href="/search?keyword=Senior">Senior</Link>,
      <Link href="/search?keyword=Software Engineer"> Software Engineer</Link>
    </div>
  );
};

export default PopularSearch;
