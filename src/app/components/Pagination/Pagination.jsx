import React from "react";
import classNames from "classnames";
import './pagination.scss'

const PaginationItem = ({
  active,
  disabled,
  pageNumber,
  query = new URLSearchParams(),
  url,
  children,
}) => {
  const pageItemClasses = {
    "page-item": true,
    active,
    disabled,
  };
  const href =
    active || disabled
      ? undefined
      : `${url}?${query.toString().replace(/page=\d+/, `page=${pageNumber}`)}`;
  return (
    <li className={classNames(pageItemClasses)}>
      <a className="page-link" href={href}>
        {children}
      </a>
    </li>
  );
};

const Pagination = ({ currentPage, description, maxPages, query, url }) => {
  const getPageItem = (pageNum) => (
    <PaginationItem
      active={pageNum === currentPage}
      key={`page-${pageNum}`}
      pageNumber={pageNum}
      query={query}
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
      return [...displayItems, getEllipsisItem(), getPageItem(maxPages)];
    } else if (currentPage >= maxPages - 4) {
      for (
        let pageNum = maxPages - (currentPage === maxPages - 4 ? 5 : 4);
        pageNum < maxPages;
        pageNum++
      ) {
        displayItems.push(getPageItem(pageNum));
      }
      return [getPageItem(1), getEllipsisItem(), ...displayItems];
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
        getEllipsisItem(),
        ...displayItems,
        getEllipsisItem(),
        getPageItem(maxPages),
      ];
    }
  };

  return (
    <nav aria-label={description} className="pagination-nav">
      <ul className="pagination">
        <PaginationItem
          disabled={currentPage === 1}
          key="previous"
          pageNumber={currentPage - 1}
          query={query}
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
          url={url}
        >
          <i className="fas fa-angle-right" />
        </PaginationItem>
      </ul>
    </nav>
  );
};

export default Pagination;
