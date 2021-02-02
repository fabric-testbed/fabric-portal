import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";
import BasicProjectForm from "../components/Project/BasicProjectForm";

import { getWhoAmI } from "../services/userInformationService.js";
import { getCurrentUser } from "../services/prPeopleService.js";

import paginate from "../utils/paginate";
import _ from "lodash";

class Projects extends React.Component {
  state = {
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
    roles: [
      "facility-operators",
      "project-leads",
      "abf0014e-72f5-44ab-ac63-5ec5a5debbb8-pm",
      "f519a2b3-14f4-4fc9-90af-8bd625bb6894-po",
      "f519a2b3-14f4-4fc9-90af-8bd625bb6894-pm"
    ],
    sortColumn: { path: "name", order: "asc" },
    radioBtnValues: [
      { display: "My Projects", value: "active", isActive: true },
      { display: "All Projects", value: "inactive", isActive: false },
    ],
  };

  // async componentDidMount() {
  //   const { data: user } = await getWhoAmI();
  //   localStorage.setItem("userID", user.uuid);
  //   const { data: people } = await getCurrentUser();
  //   this.setState({ myProjects: people.projects, roles: people.roles })
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
      myProjects: allProjects,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allProjects;
    if (searchQuery) {
      filtered = allProjects.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const myProjects = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: myProjects };
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
    const mProjects = [
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
    ];
    const aProjects = [
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
    ];

    if (value === "active") {
      this.setState({ myProjects: mProjects});
    } else if (value === "inactive") {
      this.setState({ myProjects: aProjects });
    }
  };

  render() {
    const { length: count } = this.state.myProjects;
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
        <BasicProjectForm project={this.state.myProjects[0]} />
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
            <p>Showing all {totalCount} projects in the database.</p>
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
