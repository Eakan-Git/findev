const Pagination = ({ jobs, handlePageChange }) => {
  // Check if jobs is null or undefined
  if (!jobs) {
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
  const generatePaginationLinks = () => {
    if (paginationLinks?.length <= 10) {
      return paginationLinks;
    } 
    else {
      let firstFour = paginationLinks.slice(jobs?.data?.jobs?.pagination_info?.current_page, 4);
      let lastThree = paginationLinks.slice(-3);
      let middleItem = { label: '...', active: false };

      return [...firstFour, middleItem, ...lastThree];
    }
  };
  // Access the pagination links from jobs.links
  const paginationLinks = jobs?.data?.jobs?.pagination_info?.links;
  let modifiedPaginationLinks = paginationLinks;
  // console.log(paginationLinks);
  // Check if paginationLinks is null or undefined
  if (paginationLinks?.length <= 3) {
    <>
    <nav className="ls-pagination">
        <ul>
          <li>
            <a href="#" className="current-page">
              1
            </a>
          </li>
        </ul>
      </nav>
    </>
  }
  else if(paginationLinks?.length >= 8) {
    modifiedPaginationLinks = generatePaginationLinks();
  }
  else {
    modifiedPaginationLinks = paginationLinks;
  }

  return (
    <nav className="ls-pagination">
      <ul>
        {modifiedPaginationLinks?.map((link, index) => {
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
