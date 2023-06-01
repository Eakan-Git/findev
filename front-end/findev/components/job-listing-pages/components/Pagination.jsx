const Pagination = () => {
  return (
    <nav className="ls-pagination">
      <ul>
        <li className="prev">
          <a href="#">
            <i className="fa fa-arrow-left"></i>
          </a>
        </li>
        <li>
          <a href="#" className="current-page">1</a>
        </li>
        <li>
          <a href="#">
            2
          </a>
        </li>
        <li>
          <a href="#">3</a>
        </li>
        <li className="next">
          <a href="#">
            <i className="fa fa-arrow-right"></i>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Pagination;
