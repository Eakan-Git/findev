const Pagination = ({ paginationLinks, handlePageChange }) => {
  return (
    <nav className="ls-pagination">
    <ul>
      {paginationLinks.map((link, index) => {
        if (link.active) {
          return (
            <li key={index}>
              <a
                className="current-page"
                onClick={() => {
                  handlePageChange(link.label)
                }}
              >
                {link.label}
              </a>
            </li>
          );
        } else {
          return (
            <li key={index}>
              <a
                onClick={() => handlePageChange(link.label)}
              >
                {link.label === "&laquo; Previous" ? (
                  <i className="fa fa-arrow-left"></i>
                ) : link.label === "Next &raquo;" ? (
                  <i className="fa fa-arrow-right"></i>
                ) : (
                  link.label
                )}
              </a>
            </li>
          );
        }
      })}
    </ul>
  </nav>
  );
};

export default Pagination;
