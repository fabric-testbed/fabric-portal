import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import SpinnerWithText from "../common/SpinnerWithText";
import Pagination from "../common/Pagination";
import ProjectsTable from "../Project/ProjectsTable";
import RadioBtnGroup from "../common/RadioBtnGroup";
import { getCurrentUser } from "../../services/peopleService.js";
import { getProjects } from "../../services/projectService.js";
import { default as portalData } from "../../services/portalData.json";
import checkGlobalRoles from "@/lib/permissions/checkGlobalRoles";
import toLocaleTime from "../../utils/toLocaleTime";
import Multiselect from 'multiselect-react-dropdown';
import { toast } from "react-toastify";
import Dropdown from 'react-bootstrap/Dropdown';
import { LogIn, Search, HelpCircle } from "lucide-react";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [radioBtnValues, setRadioBtnValues] = useState([
    { display: "My Projects", value: "myProjects", isActive: true },
    { display: "All Projects", value: "allProjects", isActive: false },
  ]);
  const [globalRoles, setGlobalRoles] = useState({
    isProjectAdmin: false,
    isFacilityOperator: false,
    isActiveUser: false,
    isJupterhubUser: false,
  });
  const [options] = useState([
    { name: "Software", id: 1 }, { name: "Hardware", id: 2 }, { name: "Networks", id: 3 },
    { name: "Computer systems organization", id: 4 }, { name: "Information systems", id: 5 },
    { name: "Security and privacy", id: 6 }, { name: "Human-centered computing", id: 7 }, { name: "Applied computing", id: 8 },
    { name:  "Mathematics of computing", id: 9 }, { name: "Computing methodologies", id: 10 }, { name: "HPC", id: 11 }, { name: "RNE", id: 12}
  ]);
  const [filterOption, setFilterOption] = useState("description");
  const [selectedList] = useState([]);
  const [showSpinner, setShowSpinner] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setShowSpinner(true);
      try {
        const { data: res1 } = await getCurrentUser();
        const user = res1.results[0];
        const { data: res2 } = await getProjects("myProjects", 0, pageSize);
        const count = res2.total;
        let loadedProjects = res2.results;

        loadedProjects = loadedProjects.map((p) => {
          p.created_time  = toLocaleTime(p.created);
          return p;
        });

        setGlobalRoles(checkGlobalRoles(user));
        setProjects(loadedProjects);
        setProjectsCount(count);
        setShowSpinner(false);
      } catch (err) {
        setShowSpinner(false);
        toast.error("Failed to load projects. Please reload this page.");
      }
    };
    loadData();
  }, []);

  const getProjectType = useCallback((btnValues) => {
    return btnValues.filter(btn => btn.isActive)[0].value;
  }, []);

  const generateCommunityFilterQuery = useCallback((list) => {
    const communities = [];
    for (const s of list) {
      if (s.name === "HPC" || s.name === "RNE") {
        communities.push(`Additional Communities:${s.name}`);
      } else {
        communities.push(s.name);
        if (portalData.communityMapping[s.name]) {
          for (const sub of portalData.communityMapping[s.name]) {
            communities.push(`${s.name}:${sub}`);
          }
        }
      }
    }
    return communities.toString();
  }, []);

  const reloadProjectsData = useCallback(async (overrides = {}) => {
    const effectivePage = overrides.currentPage !== undefined ? overrides.currentPage : currentPage;
    const effectiveFilterOption = overrides.filterOption !== undefined ? overrides.filterOption : filterOption;
    const effectiveSearchQuery = overrides.searchQuery !== undefined ? overrides.searchQuery : searchQuery;
    const effectiveBtnValues = overrides.radioBtnValues !== undefined ? overrides.radioBtnValues : radioBtnValues;
    const effectiveSelectedList = overrides.selectedList;

    const offset = (effectivePage - 1) * pageSize;
    let loadedProjects = [];
    let count = 0;
    if (effectiveFilterOption === "description") {
      try {
        const { data } = await getProjects(getProjectType(effectiveBtnValues), offset, pageSize, effectiveSearchQuery, "description");
        loadedProjects = data.results;
        count = data.total;
        setProjects(loadedProjects);
        setProjectsCount(count);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else if (effectiveFilterOption === "community") {
      try {
        const communityQuery = effectiveSelectedList && generateCommunityFilterQuery(effectiveSelectedList);
        const { data } =  await getProjects(getProjectType(effectiveBtnValues), offset, pageSize, communityQuery, "communities");
        loadedProjects = data.results;
        count = data.total;
        setProjects(loadedProjects);
        setProjectsCount(count);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else {
      try {
        const { data } = await getProjects(getProjectType(effectiveBtnValues), offset, pageSize);
        loadedProjects = data.results;
        count = data.total;
        setProjects(loadedProjects);
        setProjectsCount(count);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    }
  }, [currentPage, filterOption, searchQuery, radioBtnValues, pageSize, getProjectType, generateCommunityFilterQuery]);

  const handleInputChange = (e) => {
    if (searchQuery !== "" && e.target.value === "") {
      setCurrentPage(1);
      setSearchQuery("");
      reloadProjectsData({ currentPage: 1, searchQuery: "" });
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const onSelect = (list, selectedItem) => {
    reloadProjectsData({ selectedList: list });
  };

  const onRemove = (list, removedItem) => {
    reloadProjectsData({ selectedList: list });
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
    reloadProjectsData({ currentPage: newPage });
  };

  const handleProjectTypeChange = (value) => {
    const newBtnValues = radioBtnValues.map((el) =>
      el.value === value
        ? { ...el, isActive: true }
        : { ...el, isActive: false }
    );
    setRadioBtnValues(newBtnValues);
    setCurrentPage(1);
    reloadProjectsData({ currentPage: 1, radioBtnValues: newBtnValues, selectedList: [] });
  };

  const handleProjectsSearch = () => {
    setCurrentPage(1);
    reloadProjectsData({ currentPage: 1 });
  };

  const raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     handleProjectsSearch();
    }
  };

  const handleChangeFilter = (option) => {
    setFilterOption(option);
    setSearchQuery("");
    reloadProjectsData({ filterOption: option, searchQuery: "" });
  };

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
            <HelpCircle className="mx-2" size={16} />
            User Guide
          </a>
        </div>
        <div className="d-flex flex-row">
          <a
            href={portalData.jiraLinks.projectLeadRequest}
            className="btn btn-primary my-2 me-2"
            target="_blank"
            rel="noreferrer"
          >
            <LogIn className="me-2" size={16} />
            Request a New Project
          </a>
          {
            (globalRoles.isFacilityOperator || globalRoles.isProjectAdmin) &&
            <Link href="/projects/new" className="btn btn-primary create-project-btn my-2">
              Create Project
            </Link>
          }
        </div>
      </div>
      {
        radioBtnValues[0].isActive &&
        <div className="w-100 input-group my-3">
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
      }
      {
        radioBtnValues[1].isActive &&
        <div className="w-100 mt-3 d-flex flex-row">
          <Dropdown>
            <Dropdown.Toggle variant="outline-primary" id="dropdown-basic">
              <Search size={20}/>
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item onClick={() => handleChangeFilter("description")}>Description</Dropdown.Item>
              <Dropdown.Item onClick={() => handleChangeFilter("community")}>Community</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
          <div className="input-group mb-3 project-search-toolbar">
            {
              filterOption === "description" &&
                <input
                  type="text"
                  name="query"
                  className="form-control"
                  placeholder={"Search by project name and description..."}
                  value={searchQuery}
                  onChange={handleInputChange}
                  onKeyDown={raiseInputKeyDown}
                />
            }
            {
              filterOption === "description" &&
                <button
                  className="btn btn-outline-primary"
                  type="button"
                  onClick={handleProjectsSearch}
                >
                  Search
                </button>
            }
            {
              filterOption === "community" &&
              <Multiselect
                options={options}
                selectedValues={selectedList}
                onSelect={onSelect}
                onRemove={onRemove}
                displayValue="name"
                showCheckbox={true}
                placeholder={"Filter by community"}
                avoidHighlightFirstOption={true}
                hideSelectedList={true}
              />
            }
          </div>
        </div>
      }
      {
        showSpinner && <SpinnerWithText text={"Loading projects..."} />
      }
      {
        !showSpinner && projectsCount === 0 && radioBtnValues[0].isActive &&
        <div>
          <div className="d-flex flex-row justify-content-between">
            <RadioBtnGroup
              values={radioBtnValues}
              onChange={handleProjectTypeChange}
            />
            <span>{projectsCount} results.</span>
          </div>
          <div className="alert alert-warning mt-2" role="alert">
            <p className="mt-2">We could not find your project:</p>
            <ul>
              <li>
              If you meet the <a href={portalData.learnArticles.guideToProjectLeadPolicy} target="_blank" rel="noreferrer">FABRIC Project Lead Policy</a>, please submit a request for a new project via the <Link href="/experiments/projects">Experiment page</Link>.
              </li>
              <li>
                If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">student or other contributor</a>,
                please ask your project owner to add you to a project.
              </li>
            </ul>
          </div>
        </div>
      }

      {
        !showSpinner && (projectsCount > 0 || radioBtnValues[1].isActive)
        &&
        <div>
          <div className="d-flex flex-row justify-content-between mb-3">
            <RadioBtnGroup
              values={radioBtnValues}
              onChange={handleProjectTypeChange}
            />
            {
              filterOption === "community" &&  <a
              href={portalData.learnArticles.guideToCommunityList}
              target="_blank"
              rel="noreferrer"
              >
                <HelpCircle className="mx-2" size={16} />
                Project Community List
              </a>
            }
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
            onPageChange={handlePaginationClick}
          />
        </div>
      }
    </div>
  );
}

export default Projects;