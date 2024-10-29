import React from "react";
import { Link } from "react-router-dom";
import Checkbox from "../common/Checkbox";
import Pagination from "../common/Pagination";
import SearchBoxWithDropdown from "../../components/common/SearchBoxWithDropdown";
import SlicesTable from "../Slice/SlicesTable";
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { getProjects } from "../../services/projectService.js";
import { autoCreateTokens } from "../../utils/manageTokens";
import { getSlices, deleteSlice } from "../../services/sliceService.js";
import { toast } from "react-toastify";
import paginate from "../../utils/paginate";
import sleep from "../../utils/sleep";
import checkPortalType from "../../utils/checkPortalType";
import { default as portalData } from "../../services/portalData.json";
import _ from "lodash";

class Slices extends React.Component {
  jupyterLinkMap =  {
    "alpha": portalData.jupyterHubLinks.alpha,
    "beta": portalData.jupyterHubLinks.beta,
    "production": portalData.jupyterHubLinks.production
  }

  state = {
    slices: [],
    hasProject: true,
    includeDeadSlices: false,
    pageSize: 10,
    currentPage: 1,
    filterQuery: "Name",
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
    showSpinner: false,
    spinnerText: "",
    // showAllSlices: false
  };

  async componentDidMount() {
    // Show loading spinner and when waiting API response
    this.setState({ showSpinner: true, spinnerText: "Loading slices..." });
    try {
      if (window.location.href.includes("/projects")) {
        // call credential manager to generate project based tokens
        autoCreateTokens(this.props.projectId).then(async () => {
          // as_self: true
          const { data: res } = await getSlices("projectSlices", true);
          this.setState({ slices: res.data, showSpinner: false, spinnerText: "" });
        });
      } else {
        // call PR first to check if the user has project.
        const { data: res } = await getProjects("myProjects", 0, 200);
        if (res.results.length === 0) {
          this.setState({ hasProject: false, showSpinner: false, spinnerText: "" });
        } else{
          // call credential manager to generate tokens
          autoCreateTokens("all").then(async () => {
            const { data: res } = await getSlices("allSlices");
            this.setState({ slices: res.data, showSpinner: false, spinnerText: "" });
          });
        }
      }
    } catch (err) {
      toast.error("Failed to get slices. Please re-login and try again.");
    }
  }

  handlePageChange = (page, pagesCount) => {
    const currentPage = this.state.currentPage;
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage > 1) {
      this.setState({ currentPage: currentPage - 1 });
    } else if (page === -2 && currentPage < pagesCount) {
      this.setState({ currentPage: currentPage + 1 });
    } else {
      this.setState({ currentPage: page });
    }
  }

  handleFilter = (query) => {
    this.setState({ filterQuery: query, currentPage: 1 });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleIncludeDeadSlices = () => {
    const currentChoice = this.state.includeDeadSlices;
    this.setState( { includeDeadSlices: !currentChoice });
  }

  handleShowAllSlices = async () => {
    const currentChoice = this.state.showAllSlices;
    this.setState( { showAllSlice: !currentChoice, showSpinner: true, spinnerText: "Loading Slices..." });
    try {
      const { data: res } = await getSlices("projectSlices", currentChoice);
      this.setState({ slices: res.data, showSpinner: false, spinnerText: "" });
    } catch(err) {
      toast.error("Failed to load slices. Please try again.")
    }
  }

  handleDeleteAllSlices = async () => {
    try {
      this.setState({
        showSpinner: true,
        spinnerText: "Deleting all active slices..."
      })
      await deleteSlice();
      await sleep(5000);
      window.location.reload();
    }
    catch (err) {
      toast.error("Failed to delete all slices of this project.")
    }
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      filterQuery,
      searchQuery,
      includeDeadSlices,
      slices: allSlices
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allSlices;
    
    const filterMap = {
      "Name": "name",
      "ID": "slice_id",
      "State": "state",
    }

    if (searchQuery) {
      filtered = allSlices.filter(s => s[filterMap[filterQuery]].toLowerCase().includes(searchQuery.toLowerCase()));
    }

    if (!includeDeadSlices) {
      filtered = filtered.filter((s) => 
        s.state !== "Dead" && s.state !== "Closing"
      )
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const slices = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: slices };
  };

  render() {
    const { hasProject, slices, pageSize, currentPage, sortColumn, searchQuery,
      filterQuery, showSpinner, spinnerText, includeDeadSlices } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className={this.props.styleProp}>
        <h1>Slices</h1>
        {
          this.props.parent === "Projects" &&
          this.props.isProjectExpired && 
          <div className="alert alert-warning mt-3" role="alert">
            <i className="fa fa-exclamation-triangle mr-2"></i>
            This project is expired and no operations are allowed. Please renew the project if you need create slice.
          </div>
        }
        {
          this.props.parent === "Experiments" &&
          <div className="alert alert-primary alert-dismissible fade show" role="alert">
            To create slice in portal, please select a project first from 
            <Link to="/experiments#projects" onClick={() => this.props.handleChange(0)}>
              <i className="fa fa-sign-in mx-1"></i> Projects &amp; Slices
            </Link>.
          </div>
        }
        {
           this.props.parent === "UserProfile" &&
           <div className="alert alert-primary alert-dismissible fade show" role="alert">
             To create slice in portal, please select a project first from 
             <Link to="/experiments#projects">
               <i className="fa fa-sign-in mx-1"></i> Projects &amp; Slices
             </Link>.
           </div>
        }
        {
          showSpinner && <SpinnerWithText text={spinnerText} />
        }
        {
          !showSpinner && !hasProject &&
          <div className="alert alert-warning mt-4" role="alert">
            <p className="mt-2">To generate the necessary tokens for accessing slices, you have to be in a project first:</p>
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
          !showSpinner && hasProject && slices.length === 0 &&
          this.props.parent === "Projects" && 
          !this.props.isProjectExpired &&
            <div>
              <div className="d-flex flex-row">
                <Link to={`/new-slice/${this.props.projectId}`} className="btn btn-primary mr-4">
                  Create Slice in Portal
                </Link>
                <a
                  href={this.jupyterLinkMap[checkPortalType(window.location.href)]}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  Create Slice in JupyterHub
                </a>
              </div>
              <div className="alert alert-warning mt-3" role="alert">
                <p className="mt-2">
                  You have no slices in this project. Please create slices in Portal or&nbsp;
                  <a
                  href={this.jupyterLinkMap[checkPortalType(window.location.href)]}
                  target="_blank"
                  rel="noreferrer"
                  >JupyterHub</a> first. Here are some guide articles you may find helpful:
                </p>
                <p>
                  <ul>
                    <li><a href={portalData.learnArticles.guideToSliceBuilder} target="_blank" rel="noreferrer">Portal Slice Builder User Guide</a></li>
                    <li><a href={portalData.learnArticles.guideToStartExperiment} target="_blank" rel="noreferrer">Start Your First Experiment</a></li>
                    <li><a href={portalData.learnArticles.guideToInstallPythonAPI} target="_blank" rel="noreferrer">Install the FABRIC Python API</a></li>
                    <li><a href={portalData.learnArticles.guideToSliceManager} target="_blank" rel="noreferrer">Slice Manager</a></li>
                    <li><a href={portalData.learnArticles.guideToSliceEditor} target="_blank" rel="noreferrer">Slice Editor</a></li>
                  </ul>
                </p>
              </div>
            </div>
        }
        {
          !showSpinner && hasProject && slices.length === 0 &&
          this.props.parent !== "Projects" && 
          <div className="alert alert-warning mt-3" role="alert">
            <p className="mt-2">
              We couldn't find any slices belonging to you. Please create slices in Portal or &nbsp;
              <a
              href={this.jupyterLinkMap[checkPortalType(window.location.href)]}
              target="_blank"
              rel="noreferrer"
              >JupyterHub</a> first. Here are some guide articles you may find helpful:
            </p>
            <p>
              <ul>
                <li><a href={portalData.learnArticles.guideToSliceBuilder} target="_blank" rel="noreferrer">Portal Slice Builder User Guide</a></li>
                <li><a href={portalData.learnArticles.guideToStartExperiment} target="_blank" rel="noreferrer">Start Your First Experiment</a></li>
                <li><a href={portalData.learnArticles.guideToInstallPythonAPI} target="_blank" rel="noreferrer">Install the FABRIC Python API</a></li>
                <li><a href={portalData.learnArticles.guideToSliceManager} target="_blank" rel="noreferrer">Slice Manager</a></li>
                <li><a href={portalData.learnArticles.guideToSliceEditor} target="_blank" rel="noreferrer">Slice Editor</a></li>
              </ul>
            </p>
          </div>
        }
        {
          !showSpinner && hasProject && slices.length > 0 && <div>
             <div className="toolbar">
              <SearchBoxWithDropdown
                activeDropdownVal={filterQuery}
                dropdownValues={["Name", "ID", "State"]}
                value={searchQuery}
                placeholder={`Search Slices by ${filterQuery}...`}
                onDropdownChange={this.handleFilter}
                onInputChange={this.handleSearch}
                className="my-0"
              />
              {
                this.props.parent === "Projects" && !this.props.isProjectExpired &&
                <Link to={`/new-slice/${this.props.projectId}`} className="btn btn-primary create-project-btn">
                  Create Slice
                </Link>
              }
            </div>
            <div className="my-2 d-flex flex-row justify-content-between">
              <span>Showing {totalCount} slices.</span>
              {/* {
                this.props.parent === "Projects" && <Checkbox
                  label={"Show All Project Slices"}
                  id={"checkbox-show-all-slices"}
                  isChecked={showAllSlices}
                  onCheck={this.handleShowAllSlices}
                />
              } */}
              <Checkbox
                label={"Include Dead/ Closing Slices"}
                id={"checkbox-include-dead-slices"}
                isChecked={includeDeadSlices}
                onCheck={this.handleIncludeDeadSlices}
              />
              {/* {
                this.props.parent === "Projects" && totalCount > 0 && !includeDeadSlices &&
                <DeleteModal
                  name={"Delete All"}
                  text={"Are you sure you want to delete all the active slices? This process cannot be undone."}
                  id={"delete-all-slices"}
                  onDelete={() => this.handleDeleteAllSlices()}
                />
              } */}
            </div>
            <SlicesTable
              slices={data}
              sortColumn={sortColumn}
              onSort={this.handleSort}
              parent={this.props.parent}
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

export default Slices;