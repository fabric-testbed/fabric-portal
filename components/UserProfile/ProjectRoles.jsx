import React, { useState, useEffect, useCallback } from "react";
import { toast } from "react-toastify";
import { getProjects } from "../../services/projectService.js";
import Link from "next/link";
import Pagination from "../common/Pagination";
import SpinnerWithText from "../common/SpinnerWithText";
import { default as portalData } from "../../services/portalData.json";
import shortenStr from "../../utils/shortenStr.js";
import { Check, Ban } from "lucide-react";

function ProjectRoles() {
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [pageSize] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [hasAnyProjects, setHasAnyProjects] = useState(false);

  const getTextfromHTML = (htmlStr) => {
    return new DOMParser()
    .parseFromString(htmlStr, "text/html")
    .documentElement.textContent;
  };

  const renderRoleTableFields = (param) => {
    switch (typeof param) {
      case "boolean":
        return param === true ? (
          <Check className="me-2 text-success" size={16} />
        ) : (
          <Ban className="text-danger" size={16} />
        );
      case "string":
        return shortenStr(getTextfromHTML(param), 200);
      default:
        return param;
    }
  };

  const reloadProjectsData = useCallback(async (currentPageVal, searchQueryVal) => {
    const offset = (currentPageVal - 1) * pageSize;
    let newProjects = [];
    let newProjectsCount = 0;
    try {
      const { data } = await getProjects("myProjects", offset, pageSize, searchQueryVal);
      newProjects = data.results;
      newProjectsCount = data.total;
      setProjects(newProjects);
      setProjectsCount(newProjectsCount);
    } catch (err) {
      toast.error("Failed to load projects. Please re-try.");
    }
  }, [pageSize]);

  useEffect(() => {
    const loadInitialData = async () => {
      setShowSpinner(true);

      try {
        const { data: res } = await getProjects("myProjects", 0, pageSize);
        const newProjects = res.results;
        const newProjectsCount = res.total;
        setProjects(newProjects);
        setProjectsCount(newProjectsCount);
        if (newProjectsCount > 0) setHasAnyProjects(true);
        setShowSpinner(false);
      } catch (err) {
        setShowSpinner(false);
        toast.error("Failed to load user's projects'. Please re-login.");
      }
    };

    loadInitialData();
  }, []);

  const handleInputChange = (e) => {
    if (searchQuery !== "" && e.target.value === "") {
      setCurrentPage(1);
      setSearchQuery("");
      reloadProjectsData(1, "");
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const handlePaginationClick = (page, pagesCount) => {
    let newPage = currentPage;
    if (page === -1 && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (page === -2 && currentPage < pagesCount) {
      newPage = currentPage + 1;
    } else {
      newPage = page;
    }
    setCurrentPage(newPage);
    reloadProjectsData(newPage, searchQuery);
  };

  const handleProjectsSearch = () => {
    setCurrentPage(1);
    reloadProjectsData(1, searchQuery);
  };

  const raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     handleProjectsSearch();
    }
  };

  return (
    <div>
      <h4 className="mt-4">Project Roles</h4>
      {
        showSpinner && <SpinnerWithText text={"Loading project roles..."} />
      }
      {
        !showSpinner && !hasAnyProjects &&
        <div className="alert alert-warning mt-2" role="alert">
          <p className="mt-2">We could not find your project:</p>
          <p>
            <ul>
              <li>
              If you meet the <a href={portalData.learnArticles.guideToProjectLeadPolicy} target="_blank" rel="noreferrer">FABRIC Project Lead Policy</a>, please submit a request for a new project via the <Link href="/experiments/projects">Experiment page</Link>.
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
        !showSpinner && hasAnyProjects &&
        <div>
          <div className="w-100 input-group mt-3 mb-1">
            <input
              type="text"
              name="query"
              className="form-control"
              placeholder={"Search by Project Name (at least 3 letters) or Project UUID..."}
              value={searchQuery}
              onChange={handleInputChange}
              onKeyDown={raiseInputKeyDown}
            />
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={handleProjectsSearch}
            >
              Search
            </button>
          </div>
          <div className="d-flex flex-row-reverse">
            {projectsCount} results.
          </div>
          {projectsCount === 0 && (
            <div className="alert alert-info mt-2" role="alert">
              No projects found matching your search.
            </div>
          )}
          <table className="table table-striped table-bordered mt-1 mb-4 text-center">
            <tbody>
              <tr>
                <th>Name</th>
                <th>Description</th>
                <th>Facility</th>
                <th>Project Member</th>
                <th>Project Owner</th>
                <th>Long-lived Token</th>
              </tr>
              {
                projects.map((project, index) => {
                  return (
                    <tr>
                      <td>
                        <Link href={`/projects/${project.uuid}`}>{project.name}</Link>
                      </td>
                      <td>{renderRoleTableFields(project.description)}</td>
                      <td>{project.facility}</td>
                      <td>{renderRoleTableFields(project.memberships.is_member)}</td>
                      <td>{renderRoleTableFields(project.memberships.is_owner)}</td>
                      <td>{renderRoleTableFields(project.memberships.is_token_holder)}</td>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <Pagination
            itemsCount={projectsCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePaginationClick}
          />
        </div>
      }
    </div>
  );
}

export default ProjectRoles;
