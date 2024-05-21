import React from "react";
import SpinnerWithText from "../../common/SpinnerWithText.jsx";
import Pagination from "../../common/Pagination.jsx";
import ProjectsTable from "../ProjectsTable.jsx";
import { getProjects } from "../../../services/projectService.js";
import { default as portalData } from "../../../services/portalData.json";
import { toast } from "react-toastify";
import withRouter from "../../common/withRouter.jsx";

class PublicProjectsList extends React.Component {
  state = {
    projects: [],
    projectsCount: 0,
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    showSpinner: false,
    selectedCommunity: "All",
    selectCommunities: ["Networks", "Computer systems organization", "Information systems", "Security and privacy",
  "Human-centered computing", "Applied computing", "Hardware", "Software", "Mathematics of computing", "Computing methodologies",
  "HPC", "RNE"]
  };

  async componentDidMount() {
    const { pageSize: limit } = this.state;
    this.setState({ showSpinner: true });
    let query = "";
    if (this.props.location.search) {
      query = this.props.location.search.split('=')[1];
    }

    try {
      const { data: res } = await getProjects("allProjects", 0, limit, query);
      const projectsCount = res.total;
      let projects = res.results;

      this.setState({
        projects,
        projectsCount,
        showSpinner: false,
        searchQuery: query
      });
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to load projects. Please reload this page.");
    }
  }

  reloadProjectsData = async () => {
    const { pageSize: limit, currentPage, searchQuery, selectedCommunity } = this.state;
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

  handleFilter = (e) => {
    // if input gets cleared, trigger data reload and reset the search query
    if (e.target.value === "All") {
      this.setState({ currentPage: 1, selectedCommunity: "All" }, () => {
        this.reloadProjectsData();
      });
    } else {
      this.setState({ selectedCommunity: e.target.value});
      this.setState({ currentPage: 1 }, () => {
        this.reloadProjectsData();
      });
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
      projectsCount, searchQuery, selectCommunities, selectedCommunity } = this.state;

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
        <div
          className="alert alert-primary mb-2 d-flex flex-row justify-content-between align-items-center" 
          role="alert"
        >
          This is the public project list. Please log in to get access to project/ slice/ token/ SSH keys management features.
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
          !showSpinner && 
          <div>
            <div className="d-flex flex-row justify-content-between mb-3">
            <div className="input-group input-group-sm w-25">
              <div className="input-group-prepend">
                <label className="input-group-text" for="inputGroupSelect01">Community</label>
              </div>
              <select
                className="form-control form-control-sm"
                id="fundingAgencySelect"
                value={selectedCommunity}
                onChange={this.handleFilter}
              >
                <option value="All">All</option>
                { 
                  selectCommunities.map((domain, index) => 
                    <option value={domain} key={`domain-${index}`}>{domain}</option>
                  )
                }
              </select>
            </div>
              <span>{projectsCount} results.</span>
            </div>
            {
             projectsCount > 0 && 
             <div>
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
        } 
      </div>
    );
  }
}

export default withRouter(PublicProjectsList);