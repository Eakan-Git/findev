import Link from "next/link";
const PopularSearch = () => {
  return (
    <div className="popular-searches" data-aos="fade-up" data-aos-delay="1000">
      <span className="title">Tìm kiếm nhiều nhất: </span>
      <Link href="/search?title=Designer">Designer</Link>, <Link href="/search?title=Developer">Developer</Link>, <Link href="/search?title=Web">Web</Link>,
      <Link href="/search?title=IOS"> IOS</Link>, <Link href="/search?title=PHP">PHP</Link>, <Link href="/search?title=Senior">Senior</Link>,
      <Link href="/search?title=Software Engineer"> Software Engineer</Link>
    </div>
  );
};

export default PopularSearch;
