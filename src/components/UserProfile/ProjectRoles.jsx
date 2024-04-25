import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { getProjects } from "../../services/projectService.js";
import { Link } from "react-router-dom";
import Pagination from "../common/Pagination";
import SpinnerWithText from "../common/SpinnerWithText";
import { default as portalData } from "../../services/portalData.json";

class ProjectRoles extends React.Component {
  state = {
    projects: [],
    projectsCount: 0,
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    showSpinner: false,
  };

  async componentDidMount(){
    const { pageSize: limit } = this.state;
    this.setState({ showSpinner: true });

    try {
      const { data: res } = await getProjects("myProjects", 0, limit);
      const projects = res.results;
      const projectsCount = res.total;
      this.setState({ projects, projectsCount, showSpinner: false });
    } catch (err) { 
      this.setState({ showSpinner: false });
      toast.error("Failed to load user's projects'. Please re-login.");
    }
  }

  renderRoleTableFields(param) {
    switch (typeof param) {
      case "boolean":
        return param === true ? (
          <i className="fa fa-check text-success"></i>
        ) : (
          <i className="fa fa-ban text-danger"></i>
        );
      case "string":
        return _.truncate(param, {
          'length': 100,
          'separator': ' '
        });
      default:
        return param;
    }
  }

  reloadProjectsData = async () => {
    const { pageSize: limit, currentPage, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectsCount = 0;
    try {
      const { data } = await getProjects("myProjects", offset, limit, searchQuery);
      projects = data.results;
      projectsCount = data.total;
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

  handlePaginationClick = (page, pagesCount) => {
    const currentPage = this.state.currentPage;
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 }, () => {
        this.reloadProjectsData();
      });
    } else if (page === -2 && currentPage < pagesCount) {
      this.setState({ currentPage: currentPage + 1 });
    } else {
      this.setState({ currentPage: page }, () => {
        this.reloadProjectsData();
      });
    }
  };

  handleProjectsSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadProjectsData();
    });
  }

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     this.handleProjectsSearch();
    }
  };

  render() {
    const { projects, projectsCount, pageSize, showSpinner,
      currentPage, searchQuery } = this.state;
    return (
      <div>
        <h4 className="mt-4">Project Roles</h4>
        {
          showSpinner && <SpinnerWithText text={"Loading project roles..."} />
        }
        {
          !showSpinner && projectsCount === 0 &&
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
        }
        {
          !showSpinner &&  projectsCount > 0 &&
          <div>
            <div className="w-100 input-group mt-3 mb-1">
              <input
                type="text"
                name="query"
                className="form-control"
                placeholder={"Search by Project Name (at least 3 letters) or Project UUID..."}
                value={searchQuery}
                onChange={this.handleInputChange}
                onKeyDown={this.raiseInputKeyDown}
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
            <div className="d-flex flex-row-reverse">
              {projectsCount} results.
            </div>    
            <table className="table table-striped table-bordered mt-1 mb-4 text-center">
              <tbody>
                <tr>
                  <th>Project Name</th>
                  <th>Description</th>
                  <th>Facility</th>
                  <th>Project Member</th>
                  <th>Project Owner</th>
                  <th>Long-lived Token</th>
                </tr>
                {
                  projects.map((project, index) => {
                    return (
                      <tr>
                        <td>
                          <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
                        </td>
                        <td>{this.renderRoleTableFields(project.description)}</td>
                        <td>{project.facility}</td>
                        <td>{this.renderRoleTableFields(project.memberships.is_member)}</td>
                        <td>{this.renderRoleTableFields(project.memberships.is_owner)}</td>
                        <td>{this.renderRoleTableFields(project.memberships.is_token_holder)}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
            <Pagination
              itemsCount={projectsCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePaginationClick}
            />
          </div>
        }
      </div>
    )
  }
}

export default ProjectRoles;