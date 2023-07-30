const Pagination = ({ jobs, handlePageChange }) => {
  console.log("jobs", jobs);
  // Check if jobs is null or undefined
  if (!jobs?.data?.jobs?.pagination_info?.links) {
    return (
      // <nav className="ls-pagination">
      //   <ul>
      //     <li>
      //       <a href="#" className="current-page">
      //         1
      //       </a>
      //     </li>
      //   </ul>
      // </nav>
      null
    );
  }
  const generatePaginationLinks = () => {
    // console.log("paginationLinks", paginationLinks);
    if (paginationLinks?.length <= 8) {
      return paginationLinks;
    } 
    else {
      let current = jobs?.data?.jobs?.current_page;
      if(current < 3){
        let first = paginationLinks.slice(0, 5);
        let last = paginationLinks.slice(-2);
        let middleItem = { label: '...', active: false };
        return [...first, middleItem, ...last];
      }
      else if(current > paginationLinks?.length - 5){
        let first = paginationLinks.slice(0, 2);
        let last = paginationLinks.slice(-5);
        let middleItem = { label: '...', active: false };
        return [...first, middleItem, ...last];
      }
      else{
        let first = paginationLinks.slice(0, 2);
        let last = paginationLinks.slice(-2);
        let middleItem = { label: '...', active: false };
        let currentLink = { label: current, active: true };
        let leftLink = { label: current - 1, active: false };
        let rightLink = { label: current + 1, active: false };
        return [...first, middleItem, leftLink, currentLink, rightLink, middleItem, ...last];
      }
    }
  };
  // Access the pagination links from jobs.links
  const paginationLinks = jobs?.data?.jobs?.pagination_info?.links;
  let modifiedPaginationLinks = paginationLinks;
  modifiedPaginationLinks = generatePaginationLinks();

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
