"use client";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import Table from "../../../components/common/Table";
import SearchBox from "../../../components/common/SearchBox";
import Pagination from "../../../components/common/Pagination";
import { getPublications } from "../../../services/publicationService.js";
import SpinnerWithText from "../../../components/common/SpinnerWithText";
import { toast } from "react-toastify";

function PublicationTracker() {
  const [sortColumn, setSortColumn] = useState({ path: "year", order: "desc" });
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  const [totalCount, setTotalCount] = useState(0);
  const [publications, setPublications] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  const columns = useMemo(() => [
    {
      content: (publication) => (
        <div>
          {publication.link
            ? <a href={publication.link} target="_blank" rel="noreferrer">{publication.title}</a>
            : publication.title
          }
        </div>
      ),
      path: "title",
      label: "Title",
    },
    {
      content: (publication) => (
        <div><span className="me-3">{publication.year}</span></div>
      ),
      path: "year",
      label: "Year",
    },
    { content: (publication) => <div>{publication.authors}</div>, path: "", key: "authors", label: "Researchers" },
    { content: (publication) => <div>{publication.venue}</div>, path: "", key: "venue", label: "Venue" },
    {
      content: (publication) => (
        <div>
          {publication.project_name
            ? <a href={`https://portal.fabric-testbed.net/experiments/public-projects/${publication.project_uuid}`} target="_blank" rel="noreferrer">{publication.project_name}</a>
            : ""
          }
        </div>
      ),
      path: "",
      key: "project_name",
      label: "FABRIC Project",
    },
  ], []);

  const fetchPublications = useCallback(async (overrides = {}) => {
    const effectivePage = overrides.currentPage ?? currentPage;
    const effectiveSortColumn = overrides.sortColumn ?? sortColumn;
    const effectiveSearch = overrides.searchQuery !== undefined ? overrides.searchQuery : searchQuery;

    const params = {
      page: effectivePage,
      sort_by: effectiveSortColumn.path,
      order_by: effectiveSortColumn.order,
    };
    if (effectiveSearch) params.search = effectiveSearch;

    try {
      setShowSpinner(true);
      const { data } = await getPublications(params);
      const results = data.results.map(p => ({
        ...p,
        authors: p.authors.map(a => a.author_name).join(", "),
      }));
      setPublications(results);
      setTotalCount(data.count);
    } catch (err) {
      toast.error("Failed to load publications. Please reload this page.");
    } finally {
      setShowSpinner(false);
    }
  }, [currentPage, sortColumn, searchQuery]);

  useEffect(() => {
    fetchPublications();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSort = (newSortColumn) => {
    setSortColumn(newSortColumn);
    setCurrentPage(1);
    fetchPublications({ sortColumn: newSortColumn, currentPage: 1 });
  };

  const handleChange = (query) => {
    setSearchQuery(query);
    setCurrentPage(1);
    fetchPublications({ searchQuery: query, currentPage: 1 });
  };

  const handlePageChange = (page, pagesCount) => {
    let nextPage = currentPage;
    if (page === -1 && currentPage > 1) nextPage = currentPage - 1;
    else if (page === -2 && currentPage < pagesCount) nextPage = currentPage + 1;
    else if (page > 0) nextPage = page;

    if (nextPage !== currentPage) {
      setCurrentPage(nextPage);
      fetchPublications({ currentPage: nextPage });
    }
  };

  return (
    <div className="container static-page pb-4">
      <img src="/imgs/network-bg.svg" alt="static page background" className="static-page-bg" />
      <h1 className="mb-4">FABRIC User Publications</h1>
      <SearchBox
        value={searchQuery}
        placeholder="Search by title or project..."
        onChange={handleChange}
      />
      {showSpinner && <SpinnerWithText text={"Loading user publications..."} />}
      {!showSpinner && (
        <div>
          <div className="d-flex flex-row justify-content-end w-100 my-2">
            <span className="font-monospace">Displaying <b>{totalCount}</b> publications.</span>
          </div>
          <Table
            columns={columns}
            data={publications}
            sortColumn={sortColumn}
            onSort={handleSort}
            size={"md"}
            tStyle={"table-striped table-md"}
            tHeadStyle={"table-primary"}
          />
          <Pagination
            itemsCount={totalCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      )}
    </div>
  );
}

export default PublicationTracker;
