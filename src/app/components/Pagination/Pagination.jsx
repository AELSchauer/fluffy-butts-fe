import React from "react";
import dynamicClassNames from "classnames";
import "./pagination.scss";

const PaginationItem = ({
  active,
  disabled,
  pageNumber,
  query = new URLSearchParams(),
  setCurrentPage,
  url,
  children,
}) => {
  const pageItemClasses = {
    "page-item": true,
    active,
    disabled,
  };
  const updateWindowQuery = () => {
    query.set("page", pageNumber)
    var newUrl =
      window.location.protocol +
      "//" +
      window.location.host +
      window.location.pathname +
      "?" +
      query.toString();
    window.history.replaceState({}, document.title, newUrl);
  };

  const clickPagination = () => {
    if (!active && !disabled) {
      setCurrentPage(pageNumber);
      updateWindowQuery()
    }
  }

  return (
    <li className={dynamicClassNames(pageItemClasses)}>
      <a className="page-link" onClick={clickPagination}>
        {children}
      </a>
    </li>
  );
};

const Pagination = ({ currentPage = 1, description, maxPages, query, setCurrentPage, url }) => {
  const getPageItem = (pageNum) => (
    <PaginationItem
      active={pageNum === currentPage}
      key={`page-${pageNum}`}
      pageNumber={pageNum}
      query={query}
      setCurrentPage={setCurrentPage}
      url={url}
    >
      {pageNum}
    </PaginationItem>
  );

  const getEllipsisItem = (index) => (
    <PaginationItem disabled={true} key={`elipsis-${index}`}>
      <i className="fas fa-ellipsis-h" />
    </PaginationItem>
  );

  const getPaginationDisplayItems = () => {
    const displayItems = [];
    if (maxPages <= 8) {
      for (let pageNum = 1; pageNum <= maxPages; pageNum++) {
        displayItems.push(getPageItem(pageNum));
      }
      return displayItems;
    } else if (currentPage <= 4) {
      for (let pageNum = 1; pageNum <= (currentPage === 4 ? 5 : 4); pageNum++) {
        displayItems.push(getPageItem(pageNum));
      }
      return [...displayItems, getEllipsisItem(1), getPageItem(maxPages)];
    } else if (currentPage >= maxPages - 4) {
      for (
        let pageNum = maxPages - (currentPage === maxPages - 4 ? 5 : 4);
        pageNum <= maxPages;
        pageNum++
        ) {
          displayItems.push(getPageItem(pageNum));
        }
      return [getPageItem(1), getEllipsisItem(1), ...displayItems];
    } else {
      for (
        let pageNum = currentPage - 1;
        pageNum <= currentPage + 1;
        pageNum++
      ) {
        displayItems.push(getPageItem(pageNum));
      }
      return [
        getPageItem(1),
        getEllipsisItem(1),
        ...displayItems,
        getEllipsisItem(2),
        getPageItem(maxPages),
      ];
    }
  };

  const paginationClasses = {
    "pagination-nav": true,
    "pagination-sm": window.innerWidth < 576,
  };

  return (
    <nav
      aria-label={description}
      className={dynamicClassNames(paginationClasses)}
    >
      <ul className="pagination">
        <PaginationItem
          disabled={currentPage === 1}
          key="previous"
          pageNumber={currentPage - 1}
          query={query}
          setCurrentPage={setCurrentPage}
          url={url}
        >
          <i className="fas fa-angle-left" />
        </PaginationItem>
        {getPaginationDisplayItems()}
        <PaginationItem
          disabled={currentPage === maxPages}
          key="next"
          pageNumber={currentPage + 1}
          query={query}
          setCurrentPage={setCurrentPage}
          url={url}
        >
          <i className="fas fa-angle-right" />
        </PaginationItem>
      </ul>
    </nav>
  );
};

export default Pagination;
