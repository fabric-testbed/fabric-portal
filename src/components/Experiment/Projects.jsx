import React from "react";
import { Link } from "react-router-dom";
import SpinnerWithText from "../common/SpinnerWithText";
import Pagination from "../common/Pagination";
import ProjectsTable from "../Project/ProjectsTable";
import RadioBtnGroup from "../common/RadioBtnGroup";
import { getCurrentUser } from "../../services/peopleService.js";
import { getProjects } from "../../services/projectService.js";
import { default as portalData } from "../../services/portalData.json";
import checkGlobalRoles from "../../utils/checkGlobalRoles"; 
import toLocaleTime from "../../utils/toLocaleTime";
import Multiselect from 'multiselect-react-dropdown';
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
    options: [{ name: "Software", id: 1 }, { name: "Hardware", id: 2 }, { name: "Networks", id: 3 },
    { name: "Computer systems organization", id: 4 }, { name: "Information systems", id: 5 }, 
    { name: "Security and privacy", id: 6 }, { name: "Human-centered computing", id: 7 }, { name: "Applied computing", id: 8 },
    { name:  "Mathematics of computing", id: 9 }, { name: "Computing methodologies", id: 10 }, { name: "HPC", id: 11 }, { name: "RNE", id: 12} ],
    filterOption: "description",
    selectedList: [],
    showSpinner: false
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
        showSpinner: false
      });
    } catch (err) {
      this.setState({ showSpinner: false });
      toast.error("Failed to load projects. Please reload this page.");
    }
  }

  getProjectType = () => {
    return this.state.radioBtnValues.filter(btn => btn.isActive)[0].value;
  }

  generateCommunityFilterQuery = (selectedList) => {
    const communities = [];
    for (const s of selectedList) {
      communities.push(s.name);
      if (portalData.communityMapping[s.name]) {
        communities.push(`${s.name}:${portalData.communityMapping[s.name]}`);
      }
    }
    return communities.toString();
  }

  reloadProjectsData = async (selectedList) => {
    const { pageSize: limit, currentPage, filterOption, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectsCount = 0;
    if (filterOption === "description") {
      try {
        const { data } = await getProjects(this.getProjectType(), offset, limit, searchQuery, "description");
        projects = data.results;
        projectsCount = data.total;
        this.setState({ projects, projectsCount })
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else if (filterOption === "community") {
      try {
        const searchQuery = selectedList && this.generateCommunityFilterQuery(selectedList);
        const { data } =  await getProjects(this.getProjectType(), offset, limit, searchQuery, "communities");
        projects = data.results;
        projectsCount = data.total;
        this.setState({ projects, projectsCount })
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else {
      try {
        const { data } = await getProjects(this.getProjectType(), offset, limit);
        projects = data.results;
        projectsCount = data.total;
        this.setState({ projects, projectsCount })
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
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

  onSelect = (selectedList, selectedItem) => {
    this.reloadProjectsData(selectedList);
  }

  onRemove = (selectedList, removedItem) => {
    this.reloadProjectsData(selectedList);
  }

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

  handleChangeFilter = (option) =>{
    this.setState({ filterOption: option, searchQuery: ""}, () => {
      this.reloadProjectsData();
    });
  }

  render() {
    const { pageSize, currentPage, projects, showSpinner,
      projectsCount, searchQuery, filterOption, selectedList, options } = this.state;
    const { globalRoles } = this.props;

    return (
      <div className="col-9">
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
          {
            (globalRoles.isFacilityOperator || globalRoles.isProjectLead) &&
            <Link to="/projects/new" className="btn btn-primary create-project-btn my-2">
              Create Project
            </Link>
          }
        </div>
        <div className="w-100 input-group mt-3">
        <div className="input-group mb-3 project-search-toolbar">
          <div className="input-group-prepend">
            <button
              className="btn btn-outline-secondary dropdown-toggle"
              type="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i className="fa fa-search"></i>
            </button>
            <div className="dropdown-menu">
              <span className="dropdown-item" onClick={() => this.handleChangeFilter("description")}>Description</span>
              <span className="dropdown-item" onClick={() => this.handleChangeFilter("community")}>Community</span>
            </div>
          </div>
          {
            filterOption === "description" &&
              <input
                type="text"
                name="query"
                className="form-control"
                placeholder={"Search by project name and description..."}
                value={searchQuery}
                onChange={this.handleInputChange}
                onKeyDown={this.raiseInputKeyDown}
              />
          }
          {
            filterOption === "description" &&
              <div className="input-group-append">
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={this.handleProjectsSearch}
                >
                  Search
                </button>
              </div>
          }
          {
            filterOption === "community" &&  
            <Multiselect
              options={options}
              selectedValues={selectedList}
              onSelect={this.onSelect} 
              onRemove={this.onRemove} 
              displayValue="name" 
              showCheckbox={true}
              placeholder={"Filter by community"}
              avoidHighlightFirstOption={true}
              hideSelectedList={true}
            />
          }
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
              {
                filterOption === "community" &&  <a
                href={portalData.learnArticles.guideToCommunityList}
                target="_blank"
                rel="noreferrer"
                >
                  <i className="fa fa-question-circle mx-2"></i>
                  Project Community List
                </a>
              }
              <span>{projectsCount} results.</span>
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
              isPublic={false}
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