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
    projects: [
      {
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_time": "2020-12-07 20:29:56",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Test Project",
        "uuid": "abf0014e-72f5-44ab-ac63-5ec5a5debbb8"
      },
      {
        "created_by": "c3ce756d-c5b6-4501-b369-1478e4f47b6a",
        "created_time": "2021-01-29 14:35:45",
        "description": "Test Project by Account 2 (PL)",
        "facility": "FABRIC",
        "name": "Test Project by Account 2 (PL)",
        "uuid": "f519a2b3-14f4-4fc9-90af-8bd625bb6894"
      }
    ],
    allProjects: [
      {
        "created_by": {
          "email": "anonymous@fabric-testbed.net",
          "name": "anonymous user",
          "uuid": "00000000-0000-0000-0000-000000000000"
        },
        "created_time": "2020-12-07 20:29:56",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Test Project",
        "uuid": "abf0014e-72f5-44ab-ac63-5ec5a5debbb8"
      },
      {
        "created_by": {
          "email": "fabric.tb.1@gmail.com",
          "name": "FABRIC Test Account 1",
          "uuid": "e5d64d09-fb37-4101-b90a-9a899a1cc468"
        },
        "created_time": "2021-01-29 15:00:55",
        "description": "Test Project by Account 1 (FO)",
        "facility": "FABRIC",
        "name": "Test Project by Account 1 (FO)",
        "uuid": "fd53b04d-3b31-4576-a253-03d3c1bcbaac"
      },
      {
        "created_by": {
          "email": "fabric.tb.2@gmail.com",
          "name": "FABRIC Test Account 2",
          "uuid": "c3ce756d-c5b6-4501-b369-1478e4f47b6a"
        },
        "created_time": "2021-01-29 14:35:45",
        "description": "Test Project by Account 2 (PL)",
        "facility": "FABRIC",
        "name": "Test Project by Account 2 (PL)",
        "uuid": "f519a2b3-14f4-4fc9-90af-8bd625bb6894"
      }
    ],
    myProjects: [
      {
        "created_by": "00000000-0000-0000-0000-000000000000",
        "created_time": "2020-12-07 20:29:56",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Test Project",
        "uuid": "abf0014e-72f5-44ab-ac63-5ec5a5debbb8"
      },
      {
        "created_by": "c3ce756d-c5b6-4501-b369-1478e4f47b6a",
        "created_time": "2021-01-29 14:35:45",
        "description": "Test Project by Account 2 (PL)",
        "facility": "FABRIC",
        "name": "Test Project by Account 2 (PL)",
        "uuid": "f519a2b3-14f4-4fc9-90af-8bd625bb6894"
      }
    ],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    roles: [],
    sortColumn: { path: "name", order: "asc" },
    radioBtnValues: [
      { display: "My Projects", value: "active", isActive: true },
      { display: "Other Projects", value: "inactive", isActive: false },
    ],
    projectType: "myProjects",
  };

  // async componentDidMount() {
  //   const { data: user } = await getWhoAmI();
  //   localStorage.setItem("userID", user.uuid);
  //   const { data: people } = await getCurrentUser();
  //   const { data: allProjects } = await getProjects();
  //   this.setState({ 
  //     projects: people.projects,
  //     myProjects: people.projects,
  //     allProjects: allProjects,
  //     roles: people.roles,
  //   })
  // }

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
      this.setState({ projects: this.state.myProjects, projectType: "myProjects" });
    } else if (value === "inactive") {
      this.setState({ projects: this.state.allProjects, projectType: "otherProjects" });
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
            <p>Showing {totalCount} projects that you have access to view details.</p> :
            <p>Showing {totalCount} projects that you need join to view details.</p>
          }
        </div>
        <ProjectsTable
          projects={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          type={this.state.projectType}
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
