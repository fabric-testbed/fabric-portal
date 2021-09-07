import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import SearchBoxWithDropdown from "../components/common/SearchBoxWithDropdown";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";

import { getCurrentUser } from "../services/prPeopleService.js";
import { getProjects } from "../services/projectRegistryService.js";

import paginate from "../utils/paginate";
import _ from "lodash";
import { toast } from "react-toastify";

class Projects extends React.Component {
  state = {
    projects: [
      {
        "created_by": {
          "email": "anonymous@fabric-testbed.net",
          "name": "anonymous user",
          "uuid": "00000000-0000-0000-0000-000000000000"
        },
        "created_time": "2021-06-22 18:43:56",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "CF Test",
        "uuid": "10c0094a-abaf-4ef9-a532-2be53e2a896b"
      },
      {
        "created_by": {
          "email": "anonymous@fabric-testbed.net",
          "name": "anonymous user",
          "uuid": "00000000-0000-0000-0000-000000000000"
        },
        "created_time": "2021-06-30 19:57:59",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Ilya's project",
        "uuid": "afa75253-a9a6-45ec-b397-e8d29ff7c8bd"
      },
    ],
    allProjects: [
      {
        "created_by": {
          "email": "anonymous@fabric-testbed.net",
          "name": "anonymous user",
          "uuid": "00000000-0000-0000-0000-000000000000"
        },
        "created_time": "2021-06-22 18:43:56",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "CF Test",
        "uuid": "10c0094a-abaf-4ef9-a532-2be53e2a896b"
      },
      {
        "created_by": {
          "email": "anonymous@fabric-testbed.net",
          "name": "anonymous user",
          "uuid": "00000000-0000-0000-0000-000000000000"
        },
        "created_time": "2021-06-30 19:57:59",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Ilya's project",
        "uuid": "afa75253-a9a6-45ec-b397-e8d29ff7c8bd"
      },
      {
        "created_by": {
          "email": "yaxueguo@renci.org",
          "name": "Yaxue Guo",
          "uuid": "69f9b1a6-c3c3-4c53-8693-21c63e771c78"
        },
        "created_time": "2021-05-24 17:24:30",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Test Project",
        "uuid": "c3e4b3ce-ca83-4bd7-ad5b-6ce6423eeb33"
      }
    ],
    myProjects: [
      {
        "created_by": "69f9b1a6-c3c3-4c53-8693-21c63e771c78",
        "created_time": "2021-05-24 17:24:30",
        "description": "INSERT_PROJECT_DESCRIPTION",
        "facility": "FABRIC",
        "name": "Test Project",
        "uuid": "c3e4b3ce-ca83-4bd7-ad5b-6ce6423eeb33"
      }
    ],
    otherProjects: [],
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    roles: [
      "fabric-active-users",
      "project-leads",
      "c3e4b3ce-ca83-4bd7-ad5b-6ce6423eeb33-pc",
      "c3e4b3ce-ca83-4bd7-ad5b-6ce6423eeb33-po",
      "c3e4b3ce-ca83-4bd7-ad5b-6ce6423eeb33-pm"
    ],
    sortColumn: { path: "name", order: "asc" },
    radioBtnValues: [
      { display: "My Projects", value: "active", isActive: true },
      { display: "Other Projects", value: "inactive", isActive: false },
    ],
    projectType: "myProjects",
  };

  // async componentDidMount() {
  //   try {
  //     const { data: people } = await getCurrentUser();
  //     const { data: allProjects } = await getProjects();
  //     this.setState({ 
  //       projects: people.roles.indexOf("facility-operators") > -1 ? allProjects : people.projects,
  //       myProjects: people.projects,
  //       allProjects: allProjects,
  //       roles: people.roles,
  //       otherProjects: _.differenceWith(allProjects, people.projects, (x, y) => x.uuid === y.uuid),
  //     })
  //   } catch (ex) {
  //     toast.error("Failed to load projects. Please reload this page.");
  //     console.log("Failed to load projects: " + ex.response.data);
  //   }
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
      if (this.state.roles.indexOf("facility-operators") > -1) {
        this.setState({ projects: this.state.allProjects, projectType: "myProjects" });
      } else {
        this.setState({ projects: this.state.myProjects, projectType: "myProjects" });
      }
    } else if (value === "inactive") {
      if (this.state.roles.indexOf("facility-operators") > -1) { 
        this.setState({ projects: [], projectType: "otherProjects" });
      } else {
        this.setState({ projects: this.state.otherProjects, projectType: "otherProjects" });
      }
    }

    this.setState({ currentPage: 1 });
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, roles } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="container">
        <h1>Projects</h1>
        <div className="toolbar">
          <SearchBoxWithDropdown
            value={searchQuery}
            placeholder={"Search projects..."}
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
              <Link to="/projects/new" className="btn btn-primary create-project-btn">
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
            <p>Showing {totalCount} projects that you can join to view details.</p>
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
