import React from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/common/Pagination";
import ProjectsTable from "../components/Project/ProjectsTable";
import RadioBtnGroup from "../components/common/RadioBtnGroup";
import SpinnerWithText from "../components/common/SpinnerWithText";
import { getCurrentUser } from "../services/prPeopleService.js";
import { getProjects } from "../services/projectRegistryService.js";
import { getAllProjects, getMyProjects } from "../services/projectService.js";
import { default as portalData } from "../services/portalData.json";
import checkGlobalRoles from "../utils/checkGlobalRoles"; 
import paginate from "../utils/paginate"; 
import toLocaleTime from "../utils/toLocaleTime";
import _ from "lodash";
import { toast } from "react-toastify";

class Projects extends React.Component {
  state = {
    projects: [],
    allProjects: [],
    myProjects: [],
    otherProjects: [],
    pageSize: 8,
    currentPage: 1,
    searchQuery: "",
    radioBtnValues: [
      { display: "My Projects", value: "active", isActive: true },
      { display: "Other Projects", value: "inactive", isActive: false },
    ],
    projectType: "myProjects",
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

    try {
      const { data: res1 } = await getCurrentUser();
      const user = res1.results[0];
      this.setState({ globalRoles: checkGlobalRoles(user)});
      const { data: res2 } = await getAllProjects(0, 20);
      let allProjects = res2.results;
      const { data: res3 } = await getMyProjects(0, 20);
      let myProjects = res3.results;

      // parse create time field to user's local time.
      allProjects = allProjects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      myProjects = myProjects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({ 
        projects: this.state.globalRoles.isFacilityOperator ? allProjects : myProjects,
        myProjects: myProjects,
        allProjects: allProjects,
        roles: user.roles,
        otherProjects: _.differenceWith(allProjects, myProjects, (x, y) => x.uuid === y.uuid),
        showSpinner: false,
      })
    } catch (ex) {
      toast.error("Failed to load projects. Please reload this page.");
      for (const err of ex.response.data.errors) {
        console.log("Failed to load projects: " + err);
      }
    }
  }

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleInputChange = function(e) {
    this.setState({ searchQuery: e.target.value});
  };

  handleProjectSearch = async () => {
     // Show loading spinner and when waiting API response
     this.setState({ showSpinner: true });

     const searchQuery = this.state.searchQuery;

     try {
       const { data: res1 } = await getAllProjects(0, 20, searchQuery);
       let allProjects = res1.results;
       const { data: res2 } = await getMyProjects(0, 20, searchQuery);
       let myProjects = res2.results;
 
       // parse create time field to user's local time.
       allProjects = allProjects.map((p) => {
         p.created_time  = toLocaleTime(p.created);
         return p;
       });
 
       myProjects = myProjects.map((p) => {
         p.created_time  = toLocaleTime(p.created);
         return p;
       });
 
       this.setState({ 
         projects: this.state.globalRoles.isFacilityOperator ? allProjects : myProjects,
         myProjects: myProjects,
         allProjects: allProjects,
         otherProjects: _.differenceWith(allProjects, myProjects, (x, y) => x.uuid === y.uuid),
         showSpinner: false,
       })
     } catch (ex) {
       toast.error("Failed to search projects. Please re-try.");
       for (const err of ex.response.data.errors) {
         console.log("Failed to load projects: " + err);
       }
     }
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      projects: allProjects,
    } = this.state;

    const projects = paginate(allProjects, currentPage, pageSize);

    return { totalCount: allProjects.length, data: projects };
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
      if (this.state.globalRoles.isFacilityOperator) {
        this.setState({ projects: this.state.allProjects, projectType: "myProjects" });
      } else {
        this.setState({ projects: this.state.myProjects, projectType: "myProjects" });
      }
    } else if (value === "inactive") {
      if (this.state.globalRoles.isFacilityOperator) { 
        this.setState({ projects: [], projectType: "otherProjects" });
      } else {
        this.setState({ projects: this.state.otherProjects, projectType: "otherProjects" });
      }
    }

    this.setState({ currentPage: 1 });
  };

  render() {
    const { pageSize, currentPage, globalRoles, showSpinner } = this.state;
    const { totalCount, data } = this.getPageData();

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
            placeholder={"Search Projects..."}
            onChange={ this.handleInputChange }
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-secondary"
              type="button"
              onClick={this.handleProjectSearch}
            >
              Search
            </button>
          </div>
        </div>
        {
          showSpinner && <SpinnerWithText text={"Loading projects..."}/>
        }
        {
          !showSpinner && totalCount === 0 && this.state.radioBtnValues[0].isActive && 
          <div>
            <div className="d-flex flex-row justify-content-between">
              <RadioBtnGroup
                values={this.state.radioBtnValues}
                onChange={this.toggleRadioBtn}
              />
              {totalCount} results.
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
          !showSpinner && (totalCount > 0 || this.state.radioBtnValues[1].isActive)
          && 
          <div>
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
              type={this.state.projectType}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        } 
      </div>
    );
  }
}

export default Projects;