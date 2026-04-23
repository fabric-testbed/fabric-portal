import React, { useState, useEffect, useCallback } from "react";
import Alert from 'react-bootstrap/Alert';
import SpinnerWithText from "../../common/SpinnerWithText.jsx";
import Pagination from "../../common/Pagination.jsx";
import ProjectsTable from "../ProjectsTable.jsx";
import { getProjects } from "../../../services/projectService.js";
import { default as portalData } from "../../../services/portalData.json";
import { toast } from "react-toastify";
import { useSearchParams } from "next/navigation";
import Multiselect from 'multiselect-react-dropdown';
import Dropdown from 'react-bootstrap/Dropdown';
import { Search, HelpCircle } from "lucide-react";

function PublicProjectsList() {
  const searchParams = useSearchParams();

  const [projects, setProjects] = useState([]);
  const [projectsCount, setProjectsCount] = useState(0);
  const [pageSize] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [options] = useState([
    { name: "Software", id: 1 }, { name: "Hardware", id: 2 }, { name: "Networks", id: 3 },
    { name: "Computer systems organization", id: 4 }, { name: "Information systems", id: 5 },
    { name: "Security and privacy", id: 6 }, { name: "Human-centered computing", id: 7 }, { name: "Applied computing", id: 8 },
    { name:  "Mathematics of computing", id: 9 }, { name: "Computing methodologies", id: 10 }, { name: "HPC", id: 11 }, { name: "RNE", id: 12}
  ]);
  const [filterOption, setFilterOption] = useState("description");
  const [selectedList] = useState([]);

  const generateCommunityFilterQuery = (selectedList) => {
    const communities = [];
    for (const s of selectedList) {
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
  };

  const reloadProjectsData = useCallback(async (currentPageVal, filterOptionVal, searchQueryVal, selectedListVal) => {
    const offset = (currentPageVal - 1) * pageSize;
    let newProjects = [];
    let newProjectsCount = 0;
    if (filterOptionVal === "description") {
      try {
        const { data } = await getProjects("allProjects", offset, pageSize, searchQueryVal, "description");
        newProjects = data.results;
        newProjectsCount = data.total;
        setProjects(newProjects);
        setProjectsCount(newProjectsCount);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else if (filterOptionVal === "community") {
      try {
        const communityQuery = selectedListVal && generateCommunityFilterQuery(selectedListVal);
        const { data } = await getProjects("allProjects", offset, pageSize, communityQuery, "communities");
        newProjects = data.results;
        newProjectsCount = data.total;
        setProjects(newProjects);
        setProjectsCount(newProjectsCount);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    } else {
      try {
        const { data } = await getProjects("allProjects", offset, pageSize);
        newProjects = data.results;
        newProjectsCount = data.total;
        setProjects(newProjects);
        setProjectsCount(newProjectsCount);
      } catch (err) {
        toast.error("Failed to load projects. Please re-try.");
      }
    }
  }, [pageSize]);

  useEffect(() => {
    const loadInitialData = async () => {
      setShowSpinner(true);
      let query = "";
      const searchParam = searchParams.get("search");
      if (searchParam) {
        query = searchParam;
      }

      try {
        const { data: res } = await getProjects("allProjects", 0, pageSize, query);
        const newProjectsCount = res.total;
        let newProjects = res.results;

        setProjects(newProjects);
        setProjectsCount(newProjectsCount);
        setShowSpinner(false);
        setSearchQuery(query);
      } catch (err) {
        setShowSpinner(false);
        // Silent failure — projects API may require auth in some environments
      }
    };

    loadInitialData();
  }, []);

  const handleInputChange = (e) => {
    if (searchQuery !== "" && e.target.value === "") {
      setCurrentPage(1);
      setSearchQuery("");
      reloadProjectsData(1, filterOption, "", null);
    } else {
      setSearchQuery(e.target.value);
    }
  };

  const onSelect = (selectedList) => {
    reloadProjectsData(currentPage, filterOption, searchQuery, selectedList);
  };

  const onRemove = (selectedList) => {
    reloadProjectsData(currentPage, filterOption, searchQuery, selectedList);
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
    reloadProjectsData(newPage, filterOption, searchQuery, null);
  };

  const handleProjectsSearch = () => {
    setCurrentPage(1);
    reloadProjectsData(1, filterOption, searchQuery, null);
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
    reloadProjectsData(currentPage, option, "", null);
  };

  return (
    <div className="mt-4">
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
      </div>
      <Alert show={true} variant="primary">
      This is the public project list. Please log in to get access to project/ slice/ token/ SSH keys management features.
      </Alert>
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
      {
        showSpinner && <SpinnerWithText text={"Loading projects..."} />
      }
      {
        !showSpinner &&
        <div className="fade-in">
          {
              filterOption === "description" ?
              <div className="d-flex flex-row justify-content-end mb-3">
                <span>{projectsCount} results.</span>
              </div> :
              <div className="d-flex flex-row justify-content-between mb-3">
                <a
                  href={portalData.learnArticles.guideToCommunityList}
                  target="_blank"
                  rel="noreferrer"
                >
                  <HelpCircle className="mx-2" size={16} />
                  Project Community List
                </a>
                <span>{projectsCount} results.</span>
              </div>
          }

          {
           projectsCount > 0 &&
           <div>
            <ProjectsTable
              projects={projects}
              isPublic={true}
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
      }
    </div>
  );
}

export default PublicProjectsList;
