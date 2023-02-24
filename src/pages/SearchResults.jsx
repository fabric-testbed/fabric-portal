import React, {Component} from "react";
import SpinnerWithText from "../common/SpinnerWithText";
import Pagination from "../common/Pagination";
import ProjectsTable from "../Project/ProjectsTable";
import { getProjects } from "../../services/projectService.js";
import toLocaleTime from "../../utils/toLocaleTime";
import { toast } from "react-toastify";

class SearchResults extends Component {
  state = {
    searchQuery: "",
    people: [],
    pageSize: 5,
    peopleCurrentPage: 1,
    projects: [],
    projectCurrentPage: 1,
    showSpinner: false,
    projectCount: 0,
    peopleCount: 0
  }

  async componentDidMount() {
    const { pageSize: limit } = this.state;
    const searchQuery = new URLSearchParams(window.location.search).get('query');
    this.setState({ showSpinner: true, searchQuery });

    try {
      const { data: res1 } = await getProjects("allProjects", 0, limit, searchQuery);
      const projectCount = res1.total;
      let projects = res1.results;

      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({
        projects,
        projectCount,
        showSpinner: false
      });
    } catch (err) {
      toast.error("Failed to get search results. Please reload this page.");
    }
  }

  handleProjectPaginationClick = (page) => {
    this.setState({ projectCurrentPage: page }, () => {
      this.reloadProjectsData();
    });
  };

  handlePeoplePaginationClick = (page) => {
    this.setState({ peopleCurrentPage: page }, () => {
      this.reloadPeopleData();
    });
  };

  reloadProjectsData = async () => {
    const { pageSize: limit, currentPage, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectCount = 0;
    try {
      const { data } = await getProjects("allProjects", offset, limit, searchQuery);
      projects = data.results;
      projectCount = data.total;
    
      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({ projects, projectCount })
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

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     this.handleProjectsSearch();
    }
  };

  handleProjectsSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadProjectsData();
      this.reloadPeopleData();
    });
  }

  render() {
    const { pageSize, peopleCurrentPage, projectCurrentPage, projects, showSpinner, searchQuery,
      projectCount } = this.state;

    return (
      <div className="container">
          <div className="w-100 input-group my-3">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Search Project by Name/ID or Search People by Name(at least 3 characters)..."}
            value={searchQuery}
            onChange={this.handleInputChange}
            onKeyDown={this.raiseInputKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.handleSearch}
            >
              Search
            </button>
          </div>
        </div>
        <h1>Search Results</h1>
        {
          showSpinner && <SpinnerWithText text={"Loading search results..."} />
        }
        <h2>People</h2>
        <p>******TODO******</p>
        {
          !showSpinner && 
          <div>
            <h2>Projects</h2>
            <div className="d-flex flex-row justify-content-start mb-3">
              {projectCount} results.
            </div>
            {
              projectCount > 0 && <div>
                <ProjectsTable projects={projects} />
                <Pagination
                  itemsCount={projectCount}
                  pageSize={pageSize}
                  currentPage={projectCurrentPage}
                  onPageChange={this.handlePaginationClick}
                />  
              </div>
            }
          </div>
        } 
      </div>
    );
  }
};

export default SearchResults;