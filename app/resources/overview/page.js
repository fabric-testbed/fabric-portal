"use client";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Topomap from "../../../components/Resource/Topomap";
import TestbedTable from "../../../components/Resource/TestbedTable";
import NodeDetailTable from "../../../components/Resource/NodeDetailTable";
import Pagination from "../../../components/common/Pagination";
import SummaryTable from "../../../components/Resource/SummaryTable";
// import LinkTable from "../components/Resource/LinkTable";
import { sitesNameMapping } from "../../../assets/data/sites";
import sitesParser from "../../../services/parser/sitesParser";
import linksParser from "../../../services/parser/linksParser";
import facilityPortsParser from "../../../services/parser/facilityPortsParser";
import { getResources } from "../../../services/resourceService.js";
import { getLinksData } from "../../../services/mockLinkData.js";
import { facilityPortDescription } from "../../../assets/data/facility-ports-description.js";
import SpinnerWithText from "../../../components/common/SpinnerWithText";
import paginate from "../../../utils/paginate";
import _ from "lodash";
import FacilityPortTable from "../../../components/Resource/FacilityPortTable.jsx";
import LinkDetailTable from "../../../components/Resource/LinkDetailTable.jsx";

function Resources() {
  const [resources, setResources] = useState([]);
  const [sortColumn1, setSortColumn1] = useState({ path: "name", order: "desc" });
  const [sortColumn2, setSortColumn2] = useState({ path: "site", order: "desc" });
  const [currentPage1, setCurrentPage1] = useState(1);
  const [currentPage2, setCurrentPage2] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQuery2, setSearchQuery2] = useState("");
  const [activeDetailName, setActiveDetailName] = useState("StarLight");
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");
  const [linkData, setLinkData] = useState({});
  const [siteNames, setSiteNames] = useState([]);
  const [siteColorMapping, setSiteColorMapping] = useState({});
  const [availableComponents, setAvailableComponents] = useState([]);
  const [filterQuery, setFilterQuery] = useState([]);
  const [facilityPorts, setFacilityPorts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResources = async () => {
      try {
        const { data: res } = await getResources(1);
        const parsedSites = sitesParser(res.data[0], sitesNameMapping.acronymToShortName, "level1");
        const parsedFacilityPorts = facilityPortsParser(res.data[0], facilityPortDescription);
        setResources(parsedSites.parsedSites);
        setSiteNames(parsedSites.siteNames);
        setSiteColorMapping(parsedSites.siteColorMapping);
        setFacilityPorts(parsedFacilityPorts);
      } catch (err) {
        console.error("Failed to load resources:", err);
        toast.error("Failed to load resource data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchResources();
  }, []);

  const getResourcesSum = (resources) => {
    const selectedLabels = [
      "totalCore",
      "freeCore",
      "totalDisk",
      "freeDisk",
      "totalRAM",
      "freeRAM",
      "totalGPU",
      "freeGPU",
      "totalNVME",
      "freeNVME",
      "totalSmartNIC",
      "freeSmartNIC",
      "totalSharedNIC",
      "freeSharedNIC",
      "totalFPGA",
      "freeFPGA",
      "totalSwitch",
      "freeSwitch"
   ]

   const sum = {
     id: 999,
     name: "FABRIC Testbed",
   };

   _.each(resources, (resource) => {
     _.each(selectedLabels, (label) => sum[label] = (sum[label] || 0) + resource[label]);
   });

   return sum;
  };

  const getResourceByName = (resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  };

  const handleSitePageChange = (page, pagesCount) => {
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage1 > 1) {
      setCurrentPage1(currentPage1 - 1);
    } else if (page === -2 && currentPage1 < pagesCount) {
      setCurrentPage1(currentPage1 + 1);
    } else {
      setCurrentPage1(page);
    }
  };

  const handleFacilityPageChange = (page, pagesCount) => {
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage2 > 1) {
      setCurrentPage2(currentPage2 - 1);
    } else if (page === -2 && currentPage2 < pagesCount) {
      setCurrentPage2(currentPage2 + 1);
    } else {
      setCurrentPage2(page);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    setCurrentPage1(1);
  };

  const handleFacilitySearch = (query) => {
    setSearchQuery2(query);
    setCurrentPage2(1);
  };

  const handleSortSite = (newSortColumn1) => {
    setSortColumn1(newSortColumn1);
  };

  const handleSortFP = (newSortColumn2) => {
    setSortColumn2(newSortColumn2);
  };

  const handleFilterChange = (e) => {
    const component = e.target.value;
    const newFilterQuery = [...filterQuery];
    const index = newFilterQuery.indexOf(component);

    if (index > -1) {
      newFilterQuery.splice(index, 1);
    } else {
      newFilterQuery.push(component);
    }

    setFilterQuery(newFilterQuery);
    setCurrentPage1(1);
  };

  const handleActiveDetailChange = (name) => {
    setActiveDetailName(name);
    setActiveFrom("");
    setActiveTo("");
  };

  const handleLinkDetailChange = (from, to) => {
    const newLinkData = linksParser(getLinksData(), from, to);
    setActiveDetailName("");
    setActiveFrom(from);
    setActiveTo(to);
    setLinkData(newLinkData);
  };

  const getSiteData = () => {
    // filter -> sort -> paginate
    let filtered = resources;
    if (searchQuery) {
      filtered = resources.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterQuery.length > 0) {
      for (const query of filterQuery) {
        filtered = filtered.filter((p) => {
          if (p[`free${query}`] > 0) return p;
          return "";
        })
      }
    }

    let sorted = [];

    if (Array.isArray(sortColumn1.path)) {
      sorted = _.orderBy(filtered, [sortColumn1.path[0]], [sortColumn1.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn1.path], [sortColumn1.order]);
    }

    const paginatedResources = paginate(sorted, currentPage1, 5);

    return { totalCount: filtered.length, siteData: paginatedResources };
  };

  const getFPData = () => {
    // filter -> sort -> paginate
    // remove `-int` suffix in name if there is any
    let filtered = facilityPorts;

    if (searchQuery2) {
      filtered = facilityPorts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery2.toLowerCase())
      );
    }

    let sorted = [];

    if (Array.isArray(sortColumn2.path)) {
      sorted = _.orderBy(filtered, [sortColumn2.path[0]], [sortColumn2.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn2.path], [sortColumn2.order]);
    }

    const paginatedFacilityPorts = paginate(sorted, currentPage2, 10);

    return { totalFPCount: filtered.length, facilityPortData: paginatedFacilityPorts.map((p) => p.name.endsWith("-int") ? {...p, name: p.name.slice(0, -4) } : p )};
  };

  const { totalCount, siteData } = getSiteData();
  const { totalFPCount, facilityPortData } = getFPData();
  // const { totalLinkCount, links } = getLinkData();

  if (loading) {
    return (
      <div className="container d-flex justify-content-center align-items-center" style={{ minHeight: "50vh" }}>
        <SpinnerWithText text="Loading resources..." />
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Resources</h1>
      <div label="Testbed Resources">
          <div className="row my-2">
            <TestbedTable sum={getResourcesSum(resources)} />
          </div>
          <div className="row my-2">
            <div className="col-9">
              <Topomap
                onNodeChange={handleActiveDetailChange}
                // onLinkChange={handleLinkDetailChange}
                siteColorMapping={siteColorMapping}
              />
            </div>
            <div className="col-3">
              {
                activeDetailName !== "" &&
                <NodeDetailTable
                  name={activeDetailName}
                  resource={getResourceByName(resources, sitesNameMapping.shortNameToAcronym[activeDetailName])}
                  parent="resources"
                />
              }
              {
                activeFrom !== "" && activeTo !== "" &&
                <LinkDetailTable
                  from={activeFrom}
                  to={activeTo}
                  data={linkData}
                />
              }
            </div>
          </div>
          <div className="row my-2">
            <div className="col-12 bg-info rounded">
              <SummaryTable
                totalCount={totalCount}
                resources={siteData}
                sortColumn={sortColumn1}
                onSort={handleSortSite}
                onFilter={handleFilterChange}
                value={searchQuery}
                onChange={handleSearch}
              />
              <Pagination
                itemsCount={totalCount}
                pageSize={5}
                currentPage={currentPage1}
                onPageChange={handleSitePageChange}
              />
            </div>
          </div>
          {/* <div className="row mt-4 mb-2">
            <div className="col-12 bg-info rounded">
              <LinkTable
                totalCount={totalLinkCount}
                links={links}
                sortColumn={sortColumn3}
                onSort={handleSortLink}
                onFilter={handleLinkFilterChange}
                value={searchQuery3}
                onChange={handleLinkSearch}
              />
              <Pagination
                itemsCount={totalLinkCount}
                pageSize={10}
                currentPage={currentPage3}
                onPageChange={handleLinkPageChange}
              />
            </div>
          </div> */}
          <div className="row mt-4">
            <div className="col-12 bg-info rounded">
              <FacilityPortTable
                facilityPorts={facilityPortData}
                totalCount={totalFPCount}
                sortColumn={sortColumn2}
                value={searchQuery2}
                onChange={handleFacilitySearch}
                onSort={handleSortFP}
              />
               <Pagination
                itemsCount={totalFPCount}
                pageSize={10}
                currentPage={currentPage2}
                onPageChange={handleFacilityPageChange}
              />
            </div>
          </div>
        </div>
    </div>
  );
}

export default Resources;
