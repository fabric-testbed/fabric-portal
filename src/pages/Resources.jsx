import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import NodeDetailTable from "../components/Resource/NodeDetailTable";
import Pagination from "../components/common/Pagination";
import SummaryTable from "../components/Resource/SummaryTable";
import LinkTable from "../components/Resource/LinkTable";
import withRouter from "../components/common/withRouter.jsx";
import { sitesNameMapping } from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import linksParser from "../services/parser/linksParser";
import linksTableParser from "../services/parser/linksTableParser";
import facilityPortsParser from "../services/parser/facilityPortsParser";
import { getResources } from "../services/resourceService.js";
import { getLinksData } from "../services/mockLinkData.js";
import { facilityPortDescription } from "../data/facility-ports-description.js";
import { toast } from "react-toastify";
import paginate from "../utils/paginate";
import _ from "lodash";
import FacilityPortTable from "../components/Resource/FacilityPortTable.jsx";
import LinkDetailTable from "../components/Resource/LinkDetailTable.jsx";

class Resources extends Component {
  state = {
    resources: [],
    sortColumn1: { path: "name", order: "desc" },
    sortColumn2: { path: "site", order: "desc" },
    sortColumn3: { path: "in_now_value", order: "desc" },
    currentPage1: 1,
    currentPage2: 1,
    currentPage3: 1,
    searchQuery: "",
    searchQuery2: "",
    searchQuery3: "",
    activeDetailName: "StarLight",
    activeFrom: "",
    activeTo: "",
    linkData: {},
    siteNames: [],
    siteColorMapping: {},
    availableComponents: [],
    filterQuery: [],
    facilityPorts: []
  }

  async componentWillMount() {
    try {
      const { data: res } = await getResources(1);
      const parsedSites = sitesParser(res.data[0], sitesNameMapping.acronymToShortName, "level1");
      const parsedFacilityPorts = facilityPortsParser(res.data[0], facilityPortDescription);
      this.setState({
        resources: parsedSites.parsedSites,
        siteNames: parsedSites.siteNames,
        siteColorMapping: parsedSites.siteColorMapping,
        facilityPorts: parsedFacilityPorts
      });
    } catch (err) {
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }

  getResourcesSum = (resources) => {
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
  }

  getResourceByName = (resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  }

  handleLinkPageChange = (page, pagesCount) => {
    const currentPage3 = this.state.currentPage3;
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage3 > 1) {
      this.setState({ currentPage3: currentPage3 - 1 });
    } else if (page === -2 && currentPage3 < pagesCount) {
      this.setState({ currentPage3: currentPage3 + 1 });
    } else {
      this.setState({ currentPage3: page });
    }
  }

  handleSitePageChange = (page, pagesCount) => {
    const currentPage1 = this.state.currentPage1;
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage1 > 1) {
      this.setState({ currentPage1: currentPage1 - 1 });
    } else if (page === -2 && currentPage1 < pagesCount) {
      this.setState({ currentPage1: currentPage1 + 1 });
    } else {
      this.setState({ currentPage1: page });
    }
  }

  handleFacilityPageChange = (page, pagesCount) => {
    const currentPage2 = this.state.currentPage2;
    // page: -1 -> prev page; page: -2 -> next page
    if(page === -1 && currentPage2 > 1) {
      this.setState({ currentPage2: currentPage2 - 1 });
    } else if (page === -2 && currentPage2 < pagesCount) {
      this.setState({ currentPage2: currentPage2 + 1 });
    } else {
      this.setState({ currentPage2: page });
    }
  }

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage1: 1 });
  }

  handleFacilitySearch = (query) => {
    this.setState({ searchQuery2: query, currentPage2: 1 });
  }

  handleLinkSearch = (query) => {
    this.setState({ searchQuery3: query, currentPage3: 1 });
  }

  handleSortSite = (sortColumn1) => {
    this.setState({ sortColumn1 });
  }

  handleSortFP = (sortColumn2) => {
    this.setState({ sortColumn2 });
  }

  handleSortLink = (sortColumn3) => {
    this.setState({ sortColumn3 });
  }

  handleFilterChange = (e) => {
    const component = e.target.value;
    const filterQuery = this.state.filterQuery;
    const index = filterQuery.indexOf(component);

    if (index > -1) {
      filterQuery.splice(index, 1);
    } else {
      filterQuery.push(component);
    }

    this.setState({ filterQuery, currentPage1: 1 });
  }

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name, activeFrom: "", activeTo: "" });
  }

  handleLinkDetailChange = (from, to) => {
    const linkData = linksParser(getLinksData(), from, to);
    this.setState({ activeDetailName: "", activeFrom: from, activeTo: to, linkData });
  }

  getSiteData = () => {
    const {
      currentPage1,
      sortColumn1,
      searchQuery,
      resources: allResources,
      filterQuery
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allResources;
    if (searchQuery) {
      filtered = allResources.filter((p) =>
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

    const resources = paginate(sorted, currentPage1, 5);

    return { totalCount: filtered.length, siteData: resources };
  }

  getFPData = () => {
    const {
      currentPage2,
      sortColumn2,
      searchQuery2,
      facilityPorts: allFacilityPorts,
    } = this.state;

    // filter -> sort -> paginate
    // remove `-int` suffix in name if there is any
    let filtered = allFacilityPorts;

    if (searchQuery2) {
      filtered = allFacilityPorts.filter((p) =>
        p.name.toLowerCase().includes(searchQuery2.toLowerCase())
      );
    }

    let sorted = [];

    if (Array.isArray(sortColumn2.path)) {
      sorted = _.orderBy(filtered, [sortColumn2.path[0]], [sortColumn2.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn2.path], [sortColumn2.order]);
    }

    const facilityPorts = paginate(sorted, currentPage2, 10);

    return { totalFPCount: filtered.length, facilityPortData: facilityPorts.map((p) => p.name.endsWith("-int") ? {...p, name: p.name.slice(0, -4) } : p )};
  }

  getLinkData = () => {
    const {
      currentPage3,
      sortColumn3,
      searchQuery3,
    } = this.state;

    const allLinks =  linksTableParser(getLinksData());
    
    // filter -> sort -> paginate
    // remove `-int` suffix in name if there is any
    let filtered = allLinks;

    if (searchQuery3 && !searchQuery3.includes("-")) {
      filtered = allLinks.filter((l) =>
        l.src_rack.toLowerCase().includes(searchQuery3.toLowerCase()) ||
        l.dst_rack.toLowerCase().includes(searchQuery3.toLowerCase())
      );
    } else if (searchQuery3.includes("-")){
      const res = searchQuery3.split("-");
      filtered = allLinks.filter((l) =>
        l.src_rack.toLowerCase() === res[0].toLowerCase() &&
        l.dst_rack.toLowerCase() === res[1].toLowerCase()
      );
    }

    let sorted = [];

    sorted = _.orderBy(filtered, [sortColumn3.path], [sortColumn3.order]);

    const links = paginate(sorted, currentPage3, 10);

    return { totalLinkCount: filtered.length, links };
  }

  render() {
    const { currentPage1, sortColumn1, searchQuery, activeFrom, activeTo, linkData,
      activeDetailName, sortColumn2, currentPage2, searchQuery2, sortColumn3, 
      searchQuery3, currentPage3 } = this.state;
    const { totalCount, siteData } = this.getSiteData();
    const { totalFPCount, facilityPortData } = this.getFPData();
    const { totalLinkCount, links } = this.getLinkData();

    return (
      <div className="container">
        <h1>Resources</h1>
        <div label="Testbed Resources">
            <div className="row my-2">
              <TestbedTable sum={this.getResourcesSum(this.state.resources)} />
            </div>
            <div className="row my-2">
              <div className="col-9">
                <Topomap
                  onNodeChange={this.handleActiveDetailChange}
                  onLinkChange={this.handleLinkDetailChange}
                  siteColorMapping={this.state.siteColorMapping}
                />
              </div>
              <div className="col-3">
                {
                  activeDetailName !== "" && 
                  <NodeDetailTable
                    name={activeDetailName}
                    resource={this.getResourceByName(this.state.resources, sitesNameMapping.shortNameToAcronym[activeDetailName])}
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
                  onSort={this.handleSortSite}
                  onFilter={this.handleFilterChange}
                  value={searchQuery}
                  onChange={this.handleSearch}
                />
                <Pagination
                  itemsCount={totalCount}
                  pageSize={5}
                  currentPage={currentPage1}
                  onPageChange={this.handleSitePageChange}
                />
              </div>
            </div>
            <div className="row mt-4 mb-2">
              <div className="col-12 bg-info rounded">
                <LinkTable
                  totalCount={totalLinkCount}
                  links={links}
                  sortColumn={sortColumn3}
                  onSort={this.handleSortLink}
                  onFilter={this.handleLinkFilterChange}
                  value={searchQuery3}
                  onChange={this.handleLinkSearch}
                />
                <Pagination
                  itemsCount={totalLinkCount}
                  pageSize={10}
                  currentPage={currentPage3}
                  onPageChange={this.handleLinkPageChange}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 bg-info rounded">
                <FacilityPortTable
                  facilityPorts={facilityPortData}
                  totalCount={totalFPCount}
                  sortColumn={sortColumn2}
                  value={searchQuery2}
                  onChange={this.handleFacilitySearch}
                  onSort={this.handleSortFP}
                />
                 <Pagination
                  itemsCount={totalFPCount}
                  pageSize={10}
                  currentPage={currentPage2}
                  onPageChange={this.handleFacilityPageChange}
                />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

export default withRouter(Resources);