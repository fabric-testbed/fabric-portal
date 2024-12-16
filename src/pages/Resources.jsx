import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import DetailTable from "../components/Resource/DetailTable";
import Pagination from "../components/common/Pagination";
import SummaryTable from "../components/Resource/SummaryTable";
import withRouter from "../components/common/withRouter.jsx";
import { sitesNameMapping } from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import facilityPortsParser from "../services/parser/facilityPortsParser";
import { getResources } from "../services/resourceService.js";
import { toast } from "react-toastify";
import paginate from "../utils/paginate";
import _ from "lodash";
import FacilityPortTable from "../components/Resource/FacilityPortTable.jsx";

class Resources extends Component {
  state = {
    resources: [],
    sortColumn: { path: "name", order: "desc" },
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    activeDetailName: "StarLight",
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
      const parsedFacilityPorts = facilityPortsParser(res.data[0]);
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

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleFilterChange = (e) => {
    const component = e.target.value;
    const filterQuery = this.state.filterQuery;
    const index = filterQuery.indexOf(component);

    if (index > -1) {
      filterQuery.splice(index, 1);
    } else {
      filterQuery.push(component);
    }

    this.setState({ filterQuery, currentPage: 1 });
  }

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name });
  }

  getSiteData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
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
        })
      }
    }

    let sorted = [];

    if (Array.isArray(sortColumn.path)) {
      sorted = _.orderBy(filtered, [sortColumn.path[0]], [sortColumn.order]);
    } else {
      sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);
    }

    const resources = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: resources };
  };

  getFPData = () => {
    const { facilityPorts } = this.state;
    return { totalCount: facilityPorts.length, facilityPorts: facilityPorts };
  }



  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, 
      activeDetailName, facilityPorts } = this.state;
    const { totalCount, data } = this.getSiteData();
    const { totalFPCount } = this.getFPData();

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
                  onChange={this.handleActiveDetailChange}
                  siteColorMapping={this.state.siteColorMapping}
                />
              </div>
              <div className="col-3">
                <DetailTable
                  name={activeDetailName}
                  resource={this.getResourceByName(this.state.resources, sitesNameMapping.shortNameToAcronym[activeDetailName])}
                  parent="resources"
                />
              </div>
            </div>
            <div className="row my-2">
              <div className="col-12 bg-info rounded">
                <SummaryTable
                  totalCount={totalCount}
                  resources={data}
                  sortColumn={sortColumn}
                  onSort={this.handleSort}
                  onFilter={this.handleFilterChange}
                  value={searchQuery}
                  onChange={this.handleSearch}
                />
                <Pagination
                  itemsCount={totalCount}
                  pageSize={pageSize}
                  currentPage={currentPage}
                  onPageChange={this.handlePageChange}
                />
              </div>
            </div>
            <div className="row mt-4">
              <div className="col-12 bg-info rounded">
                <FacilityPortTable
                  facilityPorts={facilityPorts}
                  totalCount={facilityPorts.length}
                />
              </div>
            </div>
          </div>
      </div>
    );
  }
};

export default withRouter(Resources);