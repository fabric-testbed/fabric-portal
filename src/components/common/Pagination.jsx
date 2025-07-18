import React from "react";
import _ from "lodash";
import PropTypes from "prop-types";

const Pagination = ({ itemsCount, pageSize, currentPage, onPageChange, hidePageNumberSelection }) => {
  const pagesCount = Math.ceil(itemsCount / pageSize);
  const boundaryCount = 6;

  // don't need the pagination if only 1 page.
  if (pagesCount === 1 || pagesCount === 0) return null;

  // range(start, end, step), start included, end excluded, step is 1 by default
  let pages = [];
  if (pagesCount <= boundaryCount) {
    pages = _.range(1, pagesCount + 1);
  } else if (currentPage < boundaryCount - 1) {
    // 1, 2, 3, 4, 5, ..., n
    pages = [..._.range(1, boundaryCount), -99, pagesCount];
  } else if (currentPage >= pagesCount - 3) {
    // 1, ..., n-4, n-3, n-2, n-1, n
    pages = [1, -99, pagesCount - 4, pagesCount - 3, pagesCount - 2, pagesCount - 1, pagesCount];
  } else {
    // 1, ..., 5, 6, 7, ..., n
    pages = [1, -99, currentPage - 1, currentPage, currentPage + 1, -100, pagesCount];
  }

  return (
    <div className="pagination-container">
      {
        <nav>
        <ul className="pagination">
          <li key="prev">
            <button
              onClick={() => onPageChange(-1, pagesCount)}
              className="page-link"
              disabled={currentPage === 1}
            >
              <i className="fa fa-chevron-left"></i>
            </button>
          </li>
          {
           !hidePageNumberSelection && pages.map((page) => (
            page > 0 ?
            <li
              key={page}
              className={
                page === currentPage ? "page-item active" : "page-item"
              }
            >
              <button onClick={() => onPageChange(page, pagesCount)} className="page-link">
                {page}
              </button>
            </li> :
            <li key={page}>
              <button className="page-link">
                ...
              </button>
            </li>
          ))}
          <li key="next">
            <button
              onClick={() => onPageChange(-2, pagesCount)}
              className="page-link"
              disabled={currentPage === pagesCount}
            >
              <i className="fa fa-chevron-right"></i>
            </button>
          </li>
        </ul>
      </nav>
      }
    </div>
  );
};

Pagination.propTypes = {
  itemsCount: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  currentPage: PropTypes.number.isRequired
};

export default Pagination;
