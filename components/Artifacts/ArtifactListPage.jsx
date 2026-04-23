import React, { useState, useEffect, useCallback } from "react";
import SpinnerWithText from "../common/SpinnerWithText.jsx";
import Pagination from "../common/Pagination.jsx";
import { toast } from "react-toastify";
import { Eye, Download, Copy } from 'lucide-react';
import { getArtifacts, getArtifactsByUserID, getArtifactsByProject } from "../../services/artifactService.js";
import toLocaleTime from "../../utils/toLocaleTime.js";
import { ARTIFACT_MANAGER_APP_URL } from "@/lib/api/config";

function ArtifactListPage({ parent, user, projectId }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [artifactsCount, setArtifactsCount] = useState(0);
  const [artifacts, setArtifacts] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      setShowSpinner(true);
      if (parent === "UserProfile" && !user) {
        setShowSpinner(false);
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
        setArtifacts(data.results);
        setArtifactsCount(data.count);
        setShowSpinner(false);
      } catch (error) {
        setShowSpinner(false);
        const hasApiErrors = error.response?.data?.errors?.length > 0;
        if (!hasApiErrors) {
          toast.error("Failed to fetch artifacts. Please check your connection and try again.");
        }
      }
    };
    loadData();
  }, [user]);

  const reloadArtifactsData = useCallback(async (overrides = {}) => {
    const effectivePage = overrides.currentPage !== undefined ? overrides.currentPage : currentPage;
    const effectiveSearchQuery = overrides.searchQuery !== undefined ? overrides.searchQuery : searchQuery;
    try {
      let data;
      switch (parent) {
        case "UserProfile": {
          ({ data } = await getArtifactsByUserID(user.uuid, effectivePage));
          break;
        }
        case "Projects": {
          ({ data } = await getArtifactsByProject(projectId, effectivePage));
          break;
        }
        default:
          ({ data } = await getArtifacts(effectivePage, effectiveSearchQuery));
          break;
      }
      setArtifacts(data.results);
      setArtifactsCount(data.count);
    } catch (err) {
      const hasApiErrors = err.response?.data?.errors?.length > 0;
      if (!hasApiErrors) {
        toast.error("Failed to load artifacts. Please check your connection and try again.");
      }
    }
  }, [currentPage, searchQuery, parent, user, projectId]);

  const handleInputChange = (e) => {
    if (searchQuery !== "" && e.target.value === "") {
      setCurrentPage(1);
      setSearchQuery("");
      reloadArtifactsData({ currentPage: 1, searchQuery: "" });
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const handlePaginationClick = (page, pagesCount) => {
    let newPage;
    if(page === -1 && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (page === -2 && currentPage < pagesCount) {
      newPage = currentPage + 1;
    } else {
      newPage = page;
    }
    setCurrentPage(newPage);
    reloadArtifactsData({ currentPage: newPage });
  };

  const handleArtifactsSearch = () => {
    setCurrentPage(1);
    reloadArtifactsData({ currentPage: 1 });
  };

  const raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     handleArtifactsSearch();
    }
  };

  const artifactLinkPrefix = ARTIFACT_MANAGER_APP_URL
    ? `${ARTIFACT_MANAGER_APP_URL}/artifacts`
    : null;

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
                  onChange={handleInputChange}
                  onKeyDown={raiseInputKeyDown}
                />

                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleArtifactsSearch}
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
                      <div className="mb-1 text-primary">
                        <a
                          href={artifactLinkPrefix ? `${artifactLinkPrefix}/${item.uuid}` : undefined}
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
              onPageChange={handlePaginationClick}
            />
          </div>
        )}
    </div>
  );
}

export default ArtifactListPage;