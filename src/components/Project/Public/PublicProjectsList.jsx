import React from "react";
import SpinnerWithText from "../../common/SpinnerWithText.jsx";
import Pagination from "../../common/Pagination.jsx";
import ProjectsTable from "../ProjectsTable.jsx";
import { getProjects } from "../../../services/projectService.js";
import { default as portalData } from "../../../services/portalData.json";
import { toast } from "react-toastify";

class PublicProjectsList extends React.Component {
  state = {
    projects: [],
    projectsCount: 0,
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    showSpinner: false,
  };

  async componentDidMount() {
    const { pageSize: limit } = this.state;
    this.setState({ showSpinner: true });

    try {
      const { data: res } = await getProjects("allProjects", 0, limit);
      const projectsCount = res.total;
      let projects = res.results;

      this.setState({
        projects,
        projectsCount,
        showSpinner: false
      });
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to load projects. Please reload this page.");
    }
  }

  reloadProjectsData = async () => {
    const { pageSize: limit, currentPage, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectsCount = 0;
    try {
      const { data } = await getProjects("allProjects", offset, limit, searchQuery);
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
        this.setState({ currentPage: currentPage + 1 }, () => {
          this.reloadProjectsData();
        });
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
    const { pageSize, currentPage, projects, showSpinner,
      projectsCount, searchQuery } = this.state;

    return (
      <div className="container">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <h1>Projects</h1>
            <a
              href={portalData.learnArticles.guideToProjectPermissions}
              target="_blank"
              rel="noreferrer"
              className="mt-3"
            >
              <i className="fa fa-question-circle mx-2"></i>
              User Guide
            </a>
          </div>
        </div>
        <div className="w-100 input-group my-3">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Search by project name or science domain..."}
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
        {
          showSpinner && <SpinnerWithText text={"Loading projects..."} />
        }
        {
          !showSpinner && projectsCount > 0
          && 
          <div>
            <div className="d-flex flex-row justify-content-between mb-3">
              {projectsCount} results.
            </div>
            <ProjectsTable
              projects={projects}
              isPublic={true}
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

export default PublicProjectsList;