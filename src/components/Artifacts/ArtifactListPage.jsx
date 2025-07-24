import React from "react";
import SpinnerWithText from "../common/SpinnerWithText.jsx";
import Pagination from "../common/Pagination.jsx";
import { toast } from "react-toastify";
import withRouter from "../common/withRouter.jsx";
import { Eye, Download, Copy } from 'lucide-react';
import { getArtifacts, getArtifactsByUserID, getArtifactsByProject } from "../../services/artifactService.js";
import toLocaleTime from "../../utils/toLocaleTime.js";
import { default as config } from "../../config.json";

class ArtifactListPage extends React.Component {
  state = {
    currentPage: 1,
    searchQuery: "",
    showSpinner: false,
    artifactsCount: 0,
    artifacts: []
  };

  async componentDidMount() {
    this.setState({ showSpinner: true });
    const { parent, user, projectId } = this.props;
    if (parent === "UserProfile" && !user) {
      toast.error("User information is required to fetch artifacts.");
      this.setState({ showSpinner: false });
      return;
    }
    try {
      let data;
      switch (parent) {
        case "UserProfile": {
          ({ data } = await getArtifactsByUserID(user.uuid));
          break;
        }
        case "Projects": {
          ({ data } = await getArtifactsByProject(projectId));
          break;
        }
        default:
          ({ data } = await getArtifacts());
          break;
      }      
      this.setState({ artifacts: data.results, artifactsCount: data.count, showSpinner: false });
    } catch (error) {
      this.setState({ showSpinner: false });
      toast.error("Error fetching artifacts");
    }
  }

  reloadArtifactsData = async () => {
    const { currentPage, searchQuery} = this.state;
    const { parent, user, projectId } = this.props;
    try {
      let data;
      switch (parent) {
        case "UserProfile": {
          ({ data } = await getArtifactsByUserID(user.uuid, currentPage));
          break;
        }
        case "Projects": {
          ({ data } = await getArtifactsByProject(projectId, currentPage));
          break;
        }
        default:
          ({ data } = await getArtifacts(currentPage, searchQuery));
          break;
      }
      this.setState({ artifacts: data.results, artifactsCount: data.count })
    } catch (err) {
      toast.error("Failed to load artifacts. Please re-try.");
    }
  }

  handleInputChange = (e) => {
    // if input gets cleared, trigger data reload and reset the search query
    if (this.state.searchQuery !== "" && e.target.value === "") {
      this.setState({ currentPage: 1, searchQuery: "" }, () => {
        this.reloadArtifactsData();
      });
    } else {
      this.setState({ searchQuery: e.target.value });
    }
  };

  handlePaginationClick = (page, pagesCount) => {
      const currentPage = this.state.currentPage;
      // page: -1 -> prev page; page: -2 -> next page
      if(page === -1 && currentPage > 1) {
        this.setState({ currentPage: currentPage - 1 }, () => {
          this.reloadArtifactsData();
        });
      } else if (page === -2 && currentPage < pagesCount) {
        this.setState({ currentPage: currentPage + 1 }, () => {
          this.reloadArtifactsData();
        });
      } else {
        this.setState({ currentPage: page }, () => {
          this.reloadArtifactsData();
        });
      }
  };

  handleArtifactsSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadArtifactsData();
    });
  }

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     this.handleArtifactsSearch();
    }
  };

  render() {
    const { currentPage, artifacts, showSpinner, artifactsCount, searchQuery } = this.state;
    const artifactLinkPrefix = `${config.artifactManagerAppUrl}/artifacts`;
    const { parent } = this.props;
    return (
      <div className="mt-4">
        {
          ["UserProfile", "PublicExperiments"].includes(parent) && <h1>Artifacts</h1>
        }
        {
          showSpinner && <SpinnerWithText text={"Loading artifacts..."} />
        }
        {
          !showSpinner && artifacts.length === 0 && (
            <div className="alert alert-info" role="alert">
              No artifacts found. 
            </div>
          )
        }
        {
          !showSpinner && artifacts.length > 0 && (
            <div>
              {
                ["Experiments", "PublicExperiments"].includes(parent) &&
                <div className="input-group mb-3 project-search-toolbar">
                  <input
                    type="text"
                    name="query"
                    className="form-control"
                    placeholder={"Search artifacts by title, tag, or project name..."}
                    value={searchQuery}
                    onChange={this.handleInputChange}
                    onKeyDown={this.raiseInputKeyDown}
                  />

                  <button
                    className="btn btn-outline-primary"
                    type="button"
                    onClick={this.handleArtifactsSearch}
                  >
                    Search
                  </button>
                </div>
              }
              <div className="d-flex flex-row-reverse">
                <span>{artifactsCount} results.</span>
              </div>  
              <table className="table table-striped">
                <tbody>
                  {
                   artifacts.map((item, idx) => (
                    <tr key={idx} className="border rounded bg-light align-middle">
                      <td className="px-3 py-2">
                        <div className="mb-1 fw-semibold text-primary">
                          <a
                            href={`${artifactLinkPrefix}/${item.uuid}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-decoration-none text-primary"
                            title={`View artifact ${item.title} details`}
                          >
                            {item.title}
                          </a>
                        </div>
                        <div className="text-muted mb-2">{item.description_short}</div>
                        <div className="d-flex align-items-center text-muted small">
                          <span className="me-3">
                            <Eye size={14} className="me-1" />
                            {item.artifact_views}
                          </span>
                          <span className="me-3">
                            <Download size={14} className="me-1" />
                            {item.artifact_downloads_active} ({item.artifact_downloads_retired})
                          </span>
                          <span className="me-3">
                            <Copy size={14} className="me-1" />
                            {item.comments}
                          </span>
                          <span className="me-3">Modified at: {toLocaleTime(item.modified)}</span>
                        </div>
                      </td>
                      <td className="text-end pe-4 align-middle">
                        {item.tags.map((tag, i) => (
                          <span key={i} className="badge bg-primary me-1 text-capitalize">
                            {tag}
                          </span>
                        ))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <Pagination
                itemsCount={artifactsCount}
                pageSize={20}
                currentPage={currentPage}
                onPageChange={this.handlePaginationClick}
              />
            </div>
          )}
      </div>
    );
  }
}

export default withRouter(ArtifactListPage);