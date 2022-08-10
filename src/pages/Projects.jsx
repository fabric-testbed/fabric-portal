import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";
import SpinnerWithText from "../components/common/SpinnerWithText";
import { getCurrentUser } from "../services/prPeopleService.js";
import { getProjects } from "../services/projectService.js";
import { default as portalData } from "../services/portalData.json";
import checkGlobalRoles from "../utils/checkGlobalRoles"; 
import toLocaleTime from "../utils/toLocaleTime";
import { toast } from "react-toastify";

class Projects extends React.Component {
  state = {
    projects: [],
    projectsCount: 0,
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    radioBtnValues: [
      { display: "My Projects", value: "myProjects", isActive: true },
      { display: "All Projects", value: "allProjects", isActive: false },
    ],
    showSpinner: false,
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: false,
    },
  };

  async componentDidMount() {
    // Show loading spinner and when waiting API response
    this.setState({ showSpinner: true });
    const { pageSize: limit } = this.state;

    try {
      const { data: res1 } = await getCurrentUser();
      const user = res1.results[0];
      this.setState({ globalRoles: checkGlobalRoles(user)});
      const { data: res2 } = await getProjects("myProjects", 0, limit);
      const projectsCount = res2.total;
      let projects = res2.results;

      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({ 
        projects: projects,
        projectsCount,
        roles: user.roles,
        showSpinner: false,
      })
    } catch (ex) {
      toast.error("Failed to load projects. Please reload this page.");
      for (const err of ex.errors) {
        console.log("Failed to load projects: " + err);
      }
    }
  }

  getProjectType = () => {
    return this.state.radioBtnValues.filter(btn => btn.isActive)[0].value;
  }

  reloadProjectsData = async () => {
    // Show loading spinner and when waiting API response
    this.setState({ showSpinner: true });
    const { pageSize: limit, currentPage, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectsCount = 0;
    try {
      const { data } = await getProjects(this.getProjectType(), offset, limit, searchQuery);
      projects = data.results;
      projectsCount = data.total;
    
      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({ projects, projectsCount, showSpinner: false})
    } catch (ex) {
      toast.error("Failed to load projects. Please re-try.");
      for (const err of ex.response.data.errors) {
        console.log("Failed to load projects: " + err.details);
      }
    }
  }

  handleInputChange = (e) => {
    this.setState({ searchQuery: e.target.value});
  };

  handlePaginationClick = (page) => {
    this.setState({ currentPage: page }, () => {
      this.reloadProjectsData();
    });
  };

  handleProjectsSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadProjectsData();
    });
  }

  handleProjectTypeChange = (value) => {
    // set isActive field for radio button input style change
    this.setState((prevState) => ({
      radioBtnValues: prevState.radioBtnValues.map((el) =>
        el.value === value
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      ),
      currentPage: 1
    }), () => {
      this.reloadProjectsData();
    });
  };

  render() {
    const { pageSize, currentPage, globalRoles, showSpinner, 
      projects, projectsCount, searchQuery } = this.state;

    return (
      <div className="container">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <h1>Projects</h1>
            <a
              href="https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions"
              target="_blank"
              rel="noreferrer"
              className="mt-3"
            >
              <i className="fa fa-question-circle mx-2"></i>
              User Guide
            </a>
          </div>
          {
            (
              globalRoles.isProjectLead || 
              globalRoles.isFacilityOperator 
            )
            &&
            (
              <Link to="/projects/new" className="btn btn-primary create-project-btn my-2">
                Create Project
              </Link>
            )
          }
        </div>
        <div className="w-100 input-group my-3">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Search by Project Name..."}
            value={searchQuery}
            onChange={this.handleInputChange}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.handleProjectsSearch}
            >
              Search
            </button>
          </div>
        </div>
        {
          showSpinner && <SpinnerWithText text={"Loading projects..."}/>
        }
        {
          !showSpinner && projectsCount === 0 && this.state.radioBtnValues[0].isActive && 
          <div>
            <div className="d-flex flex-row justify-content-between">
              <RadioBtnGroup
                values={this.state.radioBtnValues}
                onChange={this.handleProjectTypeChange}
              />
              {projectsCount} results.
            </div>    
            <div className="alert alert-warning mt-2" role="alert">
              <p className="mt-2">We could not find your project:</p>
              <p>
                <ul>
                  <li>
                    If you are a <a href={portalData.starterFAQLink} target="_blank" rel="noreferrer">professor or research staff member at your institution</a>, 
                    please <Link to="/user">request to be FABRIC Project Lead</Link> from User Profile -&gt; My Roles &amp; Projects page then you can create a project.
                  </li>
                  <li>
                    If you are a <a href={portalData.starterFAQLink} target="_blank" rel="noreferrer">student or other contributor</a>, 
                    please ask your project lead to add you to a project.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        }

        {
          !showSpinner && (projectsCount > 0 || this.state.radioBtnValues[1].isActive)
          && 
          <div>
            <div className="d-flex flex-row justify-content-between mb-3">
              <RadioBtnGroup
                values={this.state.radioBtnValues}
                onChange={this.handleProjectTypeChange}
              />
              {projectsCount} results.
            </div>
            <ProjectsTable
              projects={projects}
              type={this.getProjectType()}
            />
            <Pagination
              itemsCount={projectsCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePaginationClick}
            />
          </div>
        } 
      </div>
    );
  }
}

export default Projects;