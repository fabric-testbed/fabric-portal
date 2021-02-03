import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser } from "../services/prPeopleService.js";
import { getProjects } from "../services/projectRegistryService.js";

import paginate from "../utils/paginate";
import _ from "lodash";

class Projects extends React.Component {
  state = {
    projects: [],
    allProjects:[],
    myProjects: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    roles: [],
    sortColumn: { path: "name", order: "asc" },
    radioBtnValues: [
      { display: "My Projects", value: "active", isActive: true },
      { display: "All Projects", value: "inactive", isActive: false },
    ],
  };

  async componentDidMount() {
    const { data: user } = await getWhoAmI();
    localStorage.setItem("userID", user.uuid);
    const { data: people } = await getCurrentUser();
    const { data: allProjects } = await getProjects();
    this.setState({ 
      projects: people.projects,
      myProjects: people.projects,
      allProjects: allProjects,
      roles: people.roles,
    })
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

  toggleRadioBtn = (value) => {
    // set isActive field for radio button input style change
    this.setState((prevState) => ({
      radioBtnValues: prevState.radioBtnValues.map((el) =>
        el.value === value
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      ),
    }));

    if (value === "active") {
      this.setState({ projects: this.state.myProjects});
    } else if (value === "inactive") {
      this.setState({ projects: this.state.allProjects });
    }

    this.setState({ currentPage: 1 });
  };

  render() {
    const { length: count } = this.state.projects;
    const { pageSize, currentPage, sortColumn, searchQuery, roles } = this.state;

    if (count === 0) {
      return (
        <div className="container">
          {
            (
              roles.indexOf("project-leads") > -1 || 
              roles.indexOf("facility-operators") > -1
            )
            &&
            (
              <Link to="/projects/new" className="btn btn-primary">
                Create Project
              </Link>
            )
          }
          <p className="mt-4">There is no project in the database.</p>
        </div>
      );
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
          {
            (
              roles.indexOf("project-leads") > -1 || 
              roles.indexOf("facility-operators") > -1
            )
            &&
            (
              <Link to="/projects/new" className="btn btn-primary">
                Create Project
              </Link>
            )
          }
        </div>
        <div className="d-flex flex-row justify-content-between">
          <RadioBtnGroup
            values={this.state.radioBtnValues}
            onChange={this.toggleRadioBtn}
          />
          { this.state.radioBtnValues[0].isActive ?
            <p>Showing {totalCount} projects that you are member of.</p> :
            <p>Showing {totalCount} projects in the database.</p>
          }
        </div>
        <ProjectsTable
          projects={data}
          sortColumn={sortColumn}
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
