const PopularSearch = () => {
  return (
    <div className="popular-searches" data-aos="fade-up" data-aos-delay="1000">
      <span className="title">Tìm kiếm nhiều nhất: </span>
      <a href="/search?keyword=Designer">Designer</a>, <a href="/search?keyword=Developer">Developer</a>, <a href="/search?keyword=Web">Web</a>,
      <a href="/search?keyword=IOS"> IOS</a>, <a href="/search?keyword=PHP">PHP</a>, <a href="/search?keyword=Senior">Senior</a>,
      <a href="/search?keyword=Software Engineer"> Software Engineer</a>
    </div>
  );
};

export default PopularSearch;
