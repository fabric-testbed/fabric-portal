import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Checkbox from "../common/Checkbox";
import Pagination from "../common/Pagination";
import SlicesTable from "../Slice/SlicesTable";
import SpinnerWithText from "../../components/common/SpinnerWithText";
import { getProjects } from "../../services/projectService.js";
import { autoCreateTokens } from "../../utils/manageTokens";
import { getSlices } from "../../services/sliceService.js";
import { toast } from "react-toastify";
import checkPortalType from "@/lib/permissions/checkPortalType";
import { default as portalData } from "../../services/portalData.json";
import { AlertTriangle, LogIn, Search } from "lucide-react";
import paginate from "../../utils/paginate";

const DEAD_STATES = ["Dead", "Closing"];

function Slices(props) {
  const jupyterLinkMap = {
    "alpha": portalData.jupyterHubLinks.alpha,
    "beta": portalData.jupyterHubLinks.beta,
    "production": portalData.jupyterHubLinks.production
  };

  const [allSlices, setAllSlices] = useState([]);
  const [hasProject, setHasProject] = useState(true);
  const [includeDeadSlices, setIncludeDeadSlices] = useState(false);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinnerText, setSpinnerText] = useState("");
  const [showAllSlices, setShowAllSlices] = useState(false);

  const isProjectPage = () => window.location.href.includes("/projects");

  // All filtering and pagination is done client-side.
  const filteredSlices = useMemo(() => {
    let result = allSlices;
    if (!includeDeadSlices) {
      result = result.filter(s => !DEAD_STATES.includes(s.state));
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(s => s.name.toLowerCase().includes(q));
    }
    return result;
  }, [allSlices, includeDeadSlices, searchQuery]);

  const slicesCount = filteredSlices.length;
  const slices = paginate(filteredSlices, currentPage, pageSize);
  const hasAnySlices = allSlices.length > 0;

  const fetchSlices = async (showAll) => {
    let res;
    if (isProjectPage()) {
      const { data } = await getSlices("projectSlices", !showAll);
      res = data;
    } else {
      const { data } = await getSlices("allSlices", true);
      res = data;
    }
    setAllSlices(res.data || []);
  };

  useEffect(() => {
    const loadData = async () => {
      setShowSpinner(true);
      setSpinnerText("Loading slices...");
      try {
        if (isProjectPage()) {
          await autoCreateTokens(props.projectId);
          await fetchSlices(false);
        } else {
          const { data: projectRes } = await getProjects("myProjects", 0, 1);
          if (projectRes.results.length === 0) {
            setHasProject(false);
          } else {
            await autoCreateTokens("all");
            await fetchSlices(false);
          }
        }
      } catch (err) {
        const hasApiErrors = err.response?.data?.errors?.length > 0;
        if (!hasApiErrors) {
          toast.error("Failed to get slices. Please re-login and try again.");
        }
      } finally {
        setShowSpinner(false);
        setSpinnerText("");
      }
    };
    loadData();
  }, []);

  const handlePageChange = (page, pagesCount) => {
    let newPage;
    if (page === -1 && currentPage > 1) {
      newPage = currentPage - 1;
    } else if (page === -2 && currentPage < pagesCount) {
      newPage = currentPage + 1;
    } else {
      newPage = page;
    }
    setCurrentPage(newPage);
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const handleInputChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSearch();
  };

  const handleIncludeDeadSlices = () => {
    setIncludeDeadSlices(v => !v);
    setCurrentPage(1);
  };

  const handleShowAllSlices = async () => {
    const newValue = !showAllSlices;
    setShowAllSlices(newValue);
    setCurrentPage(1);
    try {
      await fetchSlices(newValue);
    } catch (err) {
      const hasApiErrors = err.response?.data?.errors?.length > 0;
      if (!hasApiErrors) {
        toast.error("Failed to load slices. Please try again.");
      }
    }
  };

  return (
    <div className={props.styleProp}>
      <h1>Slices</h1>
      {
        props.parent === "Projects" &&
        props.isProjectExpired &&
        <div className="alert alert-warning mt-3" role="alert">
          <AlertTriangle className="me-2" size={16} />
          This project is expired and no operations are allowed. Please renew the project if you need create slice.
        </div>
      }
      {
        props.parent === "Experiments" &&
        <div className="alert alert-primary alert-dismissible fade show" role="alert">
          To create slice in portal, please select a project first from
          <Link href="/experiments/projects" onClick={() => props.handleChange(0)}>
            <LogIn className="mx-1" size={16} /> Projects &amp; Slices
          </Link>.
        </div>
      }
      {
         props.parent === "UserProfile" &&
         <div className="alert alert-primary alert-dismissible fade show" role="alert">
           To create slice in portal, please select a project first from
           <Link href="/experiments/projects">
            <LogIn className="mx-1" size={16} /> Projects &amp; Slices
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
              If you meet the <a href={portalData.learnArticles.guideToProjectLeadPolicy} target="_blank" rel="noreferrer">FABRIC Project Lead Policy</a>, please submit a request for a new project via the <Link href="/experiments/projects">Experiment page</Link>.
              </li>
              <li>
                If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">student or other contributor</a>,
                please ask your project owner to add you to a project.
              </li>
            </ul>
          </p>
        </div>
      }
      {
        !showSpinner && hasProject && !hasAnySlices &&
        props.parent === "Projects" &&
        !props.isProjectExpired &&
          <div>
            <div className="d-flex flex-row">
              <Link href={`/experiments/new-slice/${props.projectId}`} className="btn btn-primary me-4">
                Create Slice in Portal
              </Link>
              <a
                href={jupyterLinkMap[checkPortalType(window.location.href)]}
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
                href={jupyterLinkMap[checkPortalType(window.location.href)]}
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
        !showSpinner && hasProject && !hasAnySlices &&
        props.parent !== "Projects" &&
        <div className="alert alert-warning mt-3" role="alert">
          <p className="mt-2">
            We couldn't find any slices belonging to you. Please create slices in Portal or &nbsp;
            <a
            href={jupyterLinkMap[checkPortalType(window.location.href)]}
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
        !showSpinner && hasProject && hasAnySlices && <div>
          <div className="toolbar">
            <div className="input-group my-3">
              <input
                type="text"
                className="form-control"
                placeholder="Search slices by name..."
                value={searchQuery}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
              />
              <button
                className="btn btn-outline-primary"
                type="button"
                onClick={handleSearch}
                title="Search"
              >
                <Search size={16} />
              </button>
            </div>
            {
              props.parent === "Projects" && !props.isProjectExpired &&
              <Link href={`/experiments/new-slice/${props.projectId}`} className="btn btn-primary create-project-btn">
                Create Slice
              </Link>
            }
          </div>
          <div className="my-2 d-flex flex-row justify-content-between">
            <span>Showing {slicesCount} slices.</span>
            {
              props.parent === "Projects" && <Checkbox
                label={"Show All Project Slices"}
                id={"checkbox-show-all-slices"}
                isChecked={showAllSlices}
                onCheck={handleShowAllSlices}
              />
            }
            <Checkbox
              label={"Include Dead/ Closing Slices"}
              id={"checkbox-include-dead-slices"}
              isChecked={includeDeadSlices}
              onCheck={handleIncludeDeadSlices}
            />
          </div>
          <SlicesTable
            slices={slices}
            parent={showAllSlices ? "allProjectSlices" : props.parent}
          />
          <Pagination
            itemsCount={slicesCount}
            pageSize={pageSize}
            currentPage={currentPage}
            onPageChange={handlePageChange}
          />
        </div>
      }
    </div>
  );
}

export default Slices;
