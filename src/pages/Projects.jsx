import React from "react";
import { Link } from "react-router-dom";

import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import ProjectsTable from "./ProjectsTable";

import { getProjects } from "../services/projectRegistryService";

import paginate from "../utils/paginate";
import _ from "lodash";

class Projects extends React.Component {
  state = {
    projects: [],
    projectCols: [
      { display: "Project Name", field: "name", subfield: null },
      { display: "Description", field: "description", subfield: null },
      { display: "Facility", field: "facility", subfield: null },
      { display: "Created By", field: "created_by", subfield: "name" },
      { display: "UUID", field: "uuid", subfield: null },
    ],
    pageSize: 3,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: projects } = await getProjects();
    this.setState({ projects });
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      projects: allProjects,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allProjects;
    if (searchQuery) {
      filtered = allProjects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const projects = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: projects };
  };

  render() {
    const { length: count } = this.state.projects;
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;

    if (count === 0) {
      return <p>There are no project in the database.</p>;
    }

    const { totalCount, data } = this.getPageData();

    return (
      <div className="container">
        <h1>Projects</h1>
        <p>Showing {totalCount} projects in the database.</p>
        <SearchBox value={searchQuery} onChange={this.handleSearch} />
        <ProjectsTable
          projects={data}
          sortColumn={sortColumn}
          onLike={this.handleLike}
          onSort={this.handleSort}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
      </div>
    );
  }
}

export default Projects;
