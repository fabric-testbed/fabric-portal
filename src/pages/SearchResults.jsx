import React, {Component} from "react";
import SpinnerWithText from "../components/common/SpinnerWithText";
import Pagination from "../components/common/Pagination";
import ProjectsTable from "../components/Project/ProjectsTable";
import UsersTable from "../components/Project/UsersTable";
import { getProjects } from "../services/projectService.js";
import { getFullPeopleByName } from "../services/peopleService";
import toLocaleTime from "../utils/toLocaleTime";
import { toast } from "react-toastify";

class SearchResults extends Component {
  state = {
    query: "",
    people: [],
    pageSize: 5,
    projects: [],
    currentProjectPage: 1,
    currentPeoplePage: 1,
    showSpinner: false,
    projectCount: 0,
    peopleCount: 0
  }

  async componentDidMount() {
    const { pageSize: limit } = this.state;
    const query = this.props.searchQuery;
    this.setState({ showSpinner: true, query });

    try {
      const { data: res1 } = await getProjects("allProjects", 0, limit, query);
      const projectCount = res1.total;
      let projects = res1.results;
      const { data: res2 } = await getFullPeopleByName(0, limit, query);
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
    this.setState({ currentProjectPage: page }, () => {
      this.reloadProjectsData();
    });
  };

  handlePeoplePaginationClick = (page) => {
    this.setState({ currentPeoplePage: page }, () => {
      this.reloadPeopleData();
    });
  };

  reloadProjectsData = async () => {
    const { pageSize: limit, currentProjectPage, query } = this.state;
    const offset = (currentProjectPage - 1) * limit;
    let projects = [];
    let projectCount = 0;
    try {
      const { data } = await getProjects("allProjects", offset, limit, query);
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
    const { pageSize: limit, currentPeoplePage, query } = this.state;
    const offset = (currentPeoplePage - 1) * limit;
    try {
      const { data } = await getFullPeopleByName(offset, limit, query);
      this.setState({ people: data.results, peopleCount: data.total })
    } catch (err) {
      toast.error("Failed to load people search results. Please re-try.");
    }
  }

  handleInputChange = (e) => {
    this.setState({ query: e.target.value});
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
    const { pageSize, currentProjectPage, currentPeoplePage, projects, people,
      showSpinner, query, projectCount, peopleCount } = this.state;

    return (
      <div className="container">
          <h1>Search Results</h1>
          <div className="w-100 input-group my-3">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Search Project by Name/ID or Search People by Name(at least 3 characters)..."}
            value={query}
            onChange={this.handleInputChange}
            onKeyDown={this.raiseInputKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.handleSearch}
              disabled={query.length < 3}
            >
              Search
            </button>
          </div>
        </div>
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
              peopleCount === 0 && <div className="alert alert-primary alert-dismissible fade show" role="alert">
              No users founded. Please update your search query and re-try. 
              </div>
            }
            {
              peopleCount > 0 && <div>
                  <UsersTable
                    users={people}
                    canUpdate={false}
                  />
                  <Pagination
                    itemsCount={peopleCount}
                    pageSize={pageSize}
                    currentPage={currentPeoplePage}
                    onPageChange={this.handlePeoplePaginationClick}
                  /> 
                </div>
            }
            <h2>Projects</h2>
            <div className="d-flex flex-row justify-content-start mb-3">
              {projectCount} results.
            </div>
            {
              projectCount === 0 && <div className="alert alert-primary alert-dismissible fade show" role="alert">
              No projects founded. Please update your search query and re-try. 
              </div>
            }
            {
              projectCount > 0 && <div>
                <ProjectsTable projects={projects} />
                <Pagination
                  itemsCount={projectCount}
                  pageSize={pageSize}
                  currentPage={currentProjectPage}
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