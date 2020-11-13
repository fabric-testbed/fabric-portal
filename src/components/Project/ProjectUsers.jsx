import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import ProjectUserTable from "./ProjectUserTable";

import { deleteUser } from "../services/projectRegistryService";

import paginate from "../utils/paginate";
import _ from "lodash";

class ProjectUsers extends React.Component {
  state = {
    projectId: "",
    userType: "",
    page_head: "",
    users: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  handleDelete = async (user) => {
    const originalUsers = this.state.users;
    // update the state of the component.
    // create a new users array without current selected user.
    const users = originalUsers.filter((u) => {
      return u._id !== user._id;
    });

    // new projects obj will overwrite old one in state
    this.setState({ users: users });

    try {
      await deleteUser(this.state.userType, this.state.projectId, user._id);
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        console.log("This user has already been deleted");
    }

    this.setState({ users: originalUsers });
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
          <button className="btn btn-primary">Add User</button>
        </div>
        <p>Showing {totalCount} projects in the database.</p>
        <ProjectUserTable
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

export default ProjectUsers;
