import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import ProjectsTable from "./ProjectsTable";

import { getProjects } from "../services/projectRegistryService";
import { deleteProject } from "../services/projectRegistryService";

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
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {
    const { data: projects } = await getProjects();
    this.setState({ projects });
  }

  handleDelete = async (project) => {
    const originalProjects = this.state.projects;
    // update the state of the component.
    // create a new projects array without current selected project.
    const projects = originalProjects.filter((p) => {
      return p._id !== project._id;
    });

    // new projects obj will overwrite old one in state
    this.setState({ projects: projects });

    try {
      await deleteProject(project._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        console.log("This project has already been deleted");
    }

    this.setState({ projects: originalProjects });
  };

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
        <div className="toolbar">
          <SearchBox
            value={searchQuery}
            onChange={this.handleSearch}
            className="my-0"
          />
          <Link to="/projects/new" className="btn btn-primary">
            Create Project
          </Link>
        </div>
        <p>Showing {totalCount} projects in the database.</p>
        <ProjectsTable
          projects={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          onDelete={this.handleDelete}
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
