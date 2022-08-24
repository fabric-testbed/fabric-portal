import React from "react";
import { Link } from "react-router-dom";
import SpinnerWithText from "../components/common/SpinnerWithText";
import Pagination from "../components/common/Pagination";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";
import { getCurrentUser } from "../services/peopleService.js";
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
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: false,
    },
    showSpinner: false,
  };

  async componentDidMount() {
    const { pageSize: limit } = this.state;
    this.setState({ showSpinner: true });

    try {
      const { data: res1 } = await getCurrentUser();
      const user = res1.results[0];
      const { data: res2 } = await getProjects("myProjects", 0, limit);
      const projectsCount = res2.total;
      let projects = res2.results;

      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({
        globalRoles: checkGlobalRoles(user),
        projects,
        projectsCount,
        showSpinner: false,
      })
    } catch (err) {
      toast.error("Failed to load projects. Please reload this page.");
    }
  }

  getProjectType = () => {
    return this.state.radioBtnValues.filter(btn => btn.isActive)[0].value;
  }

  reloadProjectsData = async () => {
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

      this.setState({ projects, projectsCount })
    } catch (err) {
      toast.error("Failed to load projects. Please re-try.");
    }
  }

  handleInputChange = (e) => {
    // if input gets cleared, trigger data reload and reset the search query
    if (this.state.searchQuery !== "" && e.target.value === "") {
      this.setState({ currentPage: 1, searchQuery: "" }, () => {
        this.reloadProjectsData();
      });
    } else {
      this.setState({ searchQuery: e.target.value});
    }
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
    const { pageSize, currentPage, globalRoles, projects, showSpinner,
      projectsCount, searchQuery } = this.state;

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
            placeholder={"Search by Project Name (at least 3 letters)..."}
            value={searchQuery}
            onChange={this.handleInputChange}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.handleProjectsSearch}
            >
              Search
            </button>
          </div>
        </div>
        {
          showSpinner && <SpinnerWithText text={"Loading projects..."} />
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
                    If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">professor or research staff member at your institution</a>, 
                    please <Link to="/user">request to be FABRIC Project Lead</Link> from User Profile -&gt; My Roles &amp; Projects page then you can create a project.
                  </li>
                  <li>
                    If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">student or other contributor</a>, 
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
              isFacilityOperator={globalRoles.isFacilityOperator}
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