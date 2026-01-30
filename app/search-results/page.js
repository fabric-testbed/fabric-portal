"use client";

import React, { Component } from "react";
import SpinnerWithText from "../../components/common/SpinnerWithText";
import Pagination from "../../components/common/Pagination";
import ProjectsTable from "../../components/Project/ProjectsTable";
import UsersTable from "../../components/Project/UsersTable";
import { getProjects } from "../../services/projectService.js";
import { getFullPeopleByName } from "../../services/peopleService";
import toLocaleTime from "../../utils/toLocaleTime";
import { toast } from "react-toastify";

class SearchResults extends Component {
  state = {
    query: "",
    people: [],
    pageSize: 5,
    projects: [],
    currentProjectPage: 1,
    currentPeoplePage: 1,
    showSpinner: false,
    projectCount: 0,
    peopleCount: 0
  };

  /* -------------------- query handling -------------------- */

  onQueryChange = (e) => {
    this.setState({ query: e.target.value });
  };

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val.length >= 3) {
      this.handleSearch();
    }
  };

  /* -------------------- initial / reload logic -------------------- */

  handleSearch = async () => {
    const { query } = this.state;
    if (!query || query.length < 3) return;

    this.setState(
      {
        currentPeoplePage: 1,
        currentProjectPage: 1,
        showSpinner: true
      },
      async () => {
        try {
          await Promise.all([
            this.reloadProjectsData(),
            this.reloadPeopleData()
          ]);
        } finally {
          this.setState({ showSpinner: false });
        }
      }
    );
  };

  reloadProjectsData = async () => {
    const { pageSize: limit, currentProjectPage, query } = this.state;
    const offset = (currentProjectPage - 1) * limit;

    try {
      const { data } = await getProjects(
        "allProjects",
        offset,
        limit,
        query,
        "description"
      );

      const projects = data.results.map((p) => ({
        ...p,
        created_time: toLocaleTime(p.created)
      }));

      this.setState({
        projects,
        projectCount: data.total
      });
    } catch (err) {
      toast.error("Failed to load project search results. Please re-try.");
    }
  };

  reloadPeopleData = async () => {
    const { pageSize: limit, currentPeoplePage, query } = this.state;
    const offset = (currentPeoplePage - 1) * limit;

    try {
      const { data } = await getFullPeopleByName(offset, limit, query);
      this.setState({
        people: data.results,
        peopleCount: data.total
      });
    } catch (err) {
      toast.error("Failed to load people search results. Please re-try.");
    }
  };

  /* -------------------- pagination -------------------- */

  handleProjectPaginationClick = (page, pagesCount) => {
    const { currentProjectPage } = this.state;

    const nextPage =
      page === -1
        ? currentProjectPage - 1
        : page === -2
        ? currentProjectPage + 1
        : page;

    if (nextPage < 1 || nextPage > pagesCount) return;

    this.setState({ currentProjectPage: nextPage }, this.reloadProjectsData);
  };

  handlePeoplePaginationClick = (page, pagesCount) => {
    const { currentPeoplePage } = this.state;

    const nextPage =
      page === -1
        ? currentPeoplePage - 1
        : page === -2
        ? currentPeoplePage + 1
        : page;

    if (nextPage < 1 || nextPage > pagesCount) return;

    this.setState({ currentPeoplePage: nextPage }, this.reloadPeopleData);
  };

  /* -------------------- render -------------------- */

  render() {
    const {
      query,
      pageSize,
      currentProjectPage,
      currentPeoplePage,
      projects,
      people,
      showSpinner,
      projectCount,
      peopleCount
    } = this.state;

    return (
      <div className="container">
        <h1>Search Results</h1>

        <div className="w-100 input-group my-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Project by Name/ID or Search People by Name (at least 3 characters)..."
            value={query}
            onChange={this.onQueryChange}
            onKeyDown={this.raiseInputKeyDown}
          />
          <button
            className="btn btn-outline-primary"
            type="button"
            onClick={this.handleSearch}
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
                  onPageChange={this.handlePeoplePaginationClick}
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
                  onPageChange={this.handleProjectPaginationClick}
                />
              </>
            )}
          </div>
        )}
      </div>
    );
  }
}

export default SearchResults;
