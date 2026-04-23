"use client";

import React, { useState, useCallback, useRef, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import SpinnerWithText from "../../components/common/SpinnerWithText";
import Pagination from "../../components/common/Pagination";
import ProjectsTable from "../../components/Project/ProjectsTable";
import UsersTable from "../../components/Project/UsersTable";
import { getProjects } from "../../services/projectService.js";
import { getFullPeopleByName } from "../../services/peopleService";
import toLocaleTime from "../../utils/toLocaleTime";
import { toast } from "react-toastify";

function SearchResults() {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(() => searchParams.get("query") || "");
  const [people, setPeople] = useState([]);
  const [pageSize] = useState(5);
  const [projects, setProjects] = useState([]);
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [currentPeoplePage, setCurrentPeoplePage] = useState(1);
  const [showSpinner, setShowSpinner] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [peopleCount, setPeopleCount] = useState(0);

  // Use refs to access latest state in async callbacks without stale closures
  const queryRef = useRef(query);
  queryRef.current = query;
  const pageSizeRef = useRef(pageSize);
  pageSizeRef.current = pageSize;

  /* -------------------- query handling -------------------- */

  const onQueryChange = useCallback((e) => {
    setQuery(e.target.value);
  }, []);

  /* -------------------- data loading -------------------- */

  const reloadProjectsData = useCallback(async (page) => {
    const limit = pageSizeRef.current;
    const offset = (page - 1) * limit;

    try {
      const { data } = await getProjects(
        "allProjects",
        offset,
        limit,
        queryRef.current,
        "description"
      );

      const projectsList = data.results.map((p) => ({
        ...p,
        created_time: toLocaleTime(p.created)
      }));

      setProjects(projectsList);
      setProjectCount(data.total);
    } catch (err) {
      toast.error("Failed to load project search results. Please re-try.");
    }
  }, []);

  const reloadPeopleData = useCallback(async (page) => {
    const limit = pageSizeRef.current;
    const offset = (page - 1) * limit;

    try {
      const { data } = await getFullPeopleByName(offset, limit, queryRef.current);
      setPeople(data.results);
      setPeopleCount(data.total);
    } catch (err) {
      toast.error("Failed to load people search results. Please re-try.");
    }
  }, []);

  /* -------------------- auto-search from URL param -------------------- */

  useEffect(() => {
    const initial = searchParams.get("query");
    if (initial && initial.length >= 3) {
      queryRef.current = initial;
      setShowSpinner(true);
      Promise.all([reloadProjectsData(1), reloadPeopleData(1)]).finally(() =>
        setShowSpinner(false)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSearch = useCallback(async () => {
    if (!queryRef.current || queryRef.current.length < 3) return;

    setCurrentPeoplePage(1);
    setCurrentProjectPage(1);
    setShowSpinner(true);

    try {
      await Promise.all([
        reloadProjectsData(1),
        reloadPeopleData(1)
      ]);
    } finally {
      setShowSpinner(false);
    }
  }, [reloadProjectsData, reloadPeopleData]);

  const raiseInputKeyDown = useCallback((e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val.length >= 3) {
      handleSearch();
    }
  }, [handleSearch]);

  /* -------------------- pagination -------------------- */

  const handleProjectPaginationClick = useCallback((page, pagesCount) => {
    setCurrentProjectPage((prev) => {
      const nextPage =
        page === -1
          ? prev - 1
          : page === -2
          ? prev + 1
          : page;

      if (nextPage < 1 || nextPage > pagesCount) return prev;

      reloadProjectsData(nextPage);
      return nextPage;
    });
  }, [reloadProjectsData]);

  const handlePeoplePaginationClick = useCallback((page, pagesCount) => {
    setCurrentPeoplePage((prev) => {
      const nextPage =
        page === -1
          ? prev - 1
          : page === -2
          ? prev + 1
          : page;

      if (nextPage < 1 || nextPage > pagesCount) return prev;

      reloadPeopleData(nextPage);
      return nextPage;
    });
  }, [reloadPeopleData]);

  /* -------------------- render -------------------- */

  return (
    <div className="container">
      <h1>Search Results</h1>

      <div className="w-100 input-group my-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search Project by Name/ID or Search People by Name (at least 3 characters)..."
          value={query}
          onChange={onQueryChange}
          onKeyDown={raiseInputKeyDown}
        />
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={handleSearch}
          disabled={!query || query.length < 3}
        >
          Search
        </button>
      </div>

      {showSpinner && (
        <SpinnerWithText text="Loading search results..." />
      )}

      {!showSpinner && (
        <div>
          <h2>People</h2>
          <div className="mb-3">{peopleCount} results.</div>

          {peopleCount === 0 && (
            <div className="alert alert-primary">
              No users found. Please update your search query and re-try.
            </div>
          )}

          {peopleCount > 0 && (
            <>
              <UsersTable users={people} canUpdate={false} />
              <Pagination
                itemsCount={peopleCount}
                pageSize={pageSize}
                currentPage={currentPeoplePage}
                onPageChange={handlePeoplePaginationClick}
              />
            </>
          )}

          <h2>Projects</h2>
          <div className="mb-3">{projectCount} results.</div>

          {projectCount === 0 && (
            <div className="alert alert-primary">
              No projects found. Please update your search query and re-try.
            </div>
          )}

          {projectCount > 0 && (
            <>
              <ProjectsTable projects={projects} isPublic={false} />
              <Pagination
                itemsCount={projectCount}
                pageSize={pageSize}
                currentPage={currentProjectPage}
                onPageChange={handleProjectPaginationClick}
              />
            </>
          )}
        </div>
      )}
    </div>
  );
}

export default function SearchResultsPage() {
  return (
    <Suspense>
      <SearchResults />
    </Suspense>
  );
}
