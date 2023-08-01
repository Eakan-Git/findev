const Pagination = ({ jobs, handlePageChange }) => {
  // Check if jobs is null or undefined
  if (!jobs) {
    return (
      null
    );
  }

  // Access the pagination links from jobs.links
  const paginationLinks = jobs.links;

  return (
    <nav className="ls-pagination">
      <ul>
        {paginationLinks?.map((link, index) => {
          if (link.active) {
            return (
              <li key={index}>
                <a
                  href="#"
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
                  href="#"
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
