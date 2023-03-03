import React, {Component} from "react";
import SpinnerWithText from "../components/common/SpinnerWithText";
import Pagination from "../components/common/Pagination";
import ProjectsTable from "../components/Project/ProjectsTable";
import ProjectUserTable from "../components/Project/ProjectUserTable";
import { getProjects } from "../services/projectService.js";
import { getFullPeopleByName } from "../services/peopleService";
import toLocaleTime from "../utils/toLocaleTime";
import { toast } from "react-toastify";

class SearchResults extends Component {
  state = {
    searchQuery: "",
    people: [],
    pageSize: 5,
    projects: [],
    projectCurrentPage: 1,
    peopleCurrentPage: 1,
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
      const { data: res2 } = await getFullPeopleByName(0, limit, searchQuery);
      const peopleCount = res2.total;
      let people = res2;
     
      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({
        projects,
        projectCount,
        people,
        peopleCount,
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
    const { pageSize: limit, currentProjectPage, searchQuery } = this.state;
    const offset = (currentProjectPage - 1) * limit;
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
      toast.error("Failed to load project search results. Please re-try.");
    }
  }

  reloadPeopleData = async () => {
    const { pageSize: limit, currentPeoplePage, searchQuery } = this.state;
    const offset = (currentPeoplePage - 1) * limit;
    try {
      const { data } = await getFullPeopleByName(offset, limit, searchQuery);
      this.setState({ people: data.results, peopleCount: data.total })
    } catch (err) {
      toast.error("Failed to load people search results. Please re-try.");
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
     this.handleSearch();
    }
  };

  handleSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadProjectsData();
      this.reloadPeopleData();
    });
  }

  render() {
    const { pageSize, projectCurrentPage, peopleCurrentPage, projects, people,
      showSpinner, searchQuery, projectCount, peopleCount } = this.state;

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
        {
          !showSpinner && 
          <div>
            <h2>People</h2>
            <div className="d-flex flex-row justify-content-start mb-3">
              {peopleCount} results.
            </div>
            {
              peopleCount > 0 && <div>
                  <ProjectUserTable
                    users={people}
                    canUpdate={false}
                  />
                  <Pagination
                    itemsCount={peopleCount}
                    pageSize={pageSize}
                    currentPage={peopleCurrentPage}
                    onPageChange={this.handlePeoplePaginationClick}
                  /> 
                </div>
            }
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
                  onPageChange={this.handleProjectPaginationClick}
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