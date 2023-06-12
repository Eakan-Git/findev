const Pagination = ({ companies, handlePageChange, totalPages, currentPage }) => {
  // Check if companies is null or undefined
  if (!companies) {
    return (
      <nav className="ls-pagination">
        <ul>
          <li>
            <a href="#" className="current-page">
              1
            </a>
          </li>
        </ul>
      </nav>
    );
  }

  // Access the pagination links from companies.links
  const paginationLinks = companies.links;

  return (
    <nav className="ls-pagination">
      <ul>
        {paginationLinks.map((link, index) => {
          if (link.active) {
            return (
              <li key={index}>
                <a
                  href="#"
                  className={link.label === currentPage.toString() ? "current-page" : ""}
                  onClick={() => handlePageChange(link.label, link.url)}
                >
                  {link.label}
                </a>
              </li>
            );
          } else {
            return (
              <li key={index}>
                <a href="#" onClick={() => handlePageChange(link.label, link.url)}>
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
