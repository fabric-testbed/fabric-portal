import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import DetailTable from "../components/Resource/DetailTable";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import SummaryTable from "../components/Resource/SummaryTable";

import { getResources } from "../services/resourcesService.js";
import { toast } from "react-toastify";
import paginate from "../utils/paginate";
import _ from "lodash";

class Resources extends Component {
  state = {
    resources: [],
    sortColumn: { path: "name", order: "asc" },
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    activeDetailName: "StarLight",
    nameToCode: {
      "RENCI" : "RENC",
      "UKY": "UKY",
      "LBNL": "LBNL",
    },
    codeToName: {
      "RENC" : "RENCI",
      "UKY": "UKY",
      "LBNL": "LBNL",
    },
    siteNames: [],
  }

  async componentDidMount(){
    try {
      const { data } = await getResources();
      this.setState({ resources: this.siteParser(data) });
    } catch (ex) {
      toast.error("Failed to load resource information. Please reload this page.");
      console.log("Failed to load resource information: " + ex.response.data);
    }
  }

  siteParser = (data) => {
    let abqm_elements = JSON.parse(data.value.bqm);
    const nodes = abqm_elements.nodes;
    const parsedSites = [];
    const siteNames = [];
    /************ retrieve site data from all nodes. ************/ 
    nodes.forEach(node => {
      if (node.Class === "CompositeNode") {
        const site = {};
        site.id = node.id;
        site.nodeId = node.NodeID;
        site.name = node.Name;
        // total capacities:
        site.capacities = node.Capacities ? JSON.parse(node.Capacities) : {};
        site.totalCPU = site.capacities.cpu ? site.capacities.cpu : 0;
        site.totalCore = site.capacities.core ? site.capacities.core : 0;
        site.totalDisk = site.capacities.disk ? site.capacities.disk : 0;
        site.totalRAM = site.capacities.ram ? site.capacities.ram : 0;
        site.totalUnit = site.capacities.unit ? site.capacities.unit: 0;
        // allocated capacities:
        site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};
        site.allocatedCPU = site.allocatedCapacities.cpu ? site.allocatedCapacities.cpu : 0;
        site.allocatedCore = site.allocatedCapacities.core ? site.allocatedCapacities.core : 0;
        site.allocatedDisk = site.allocatedCapacities.disk ? site.allocatedCapacities.disk : 0;
        site.allocatedRAM = site.allocatedCapacities.ram ? site.allocatedCapacities.ram : 0;
        site.allocatedUnit = site.allocatedCapacities.unit ? site.allocatedCapacities.unit: 0;
        // free capacities
        site.freeCPU = site.totalCPU - site.allocatedCPU;
        site.freeCore = site.totalCore - site.allocatedCore;
        site.freeDisk = site.totalDisk - site.allocatedDisk;
        site.freeRAM = site.totalRAM - site.allocatedRAM;
        site.freeUnit = site.totalUnit - site.allocatedUnit;
        
        parsedSites.push(site);
        siteNames.push(this.state.codeToName[site.name]);
      }
    })

    this.setState({ siteNames: siteNames });
    return parsedSites;
  }

  getResourcesSum = (resources) => {
    const selectedLabels = [
      "totalCore",
      "freeCore",
      "totalCPU",
      "freeCPU",
      "totalDisk",
      "freeDisk",
      "totalRAM",
      "freeRAM",
      "totalUnit",
      "freeUnit",
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

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  handleSearch = (query) => {
    this.setState({ searchQuery: query, currentPage: 1 });
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name });
  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      resources: allResources,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allResources;
    if (searchQuery) {
      filtered = allResources.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
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

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery, roles, activeDetailName } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="container">
        <h1>Resources</h1>
        <div className="row my-2">
          <TestbedTable sum={this.getResourcesSum(this.state.resources)} />
        </div>
        <div className="row my-2">
          <div className="col-9">
            <Topomap onChange={this.handleActiveDetailChange} sites={this.state.siteNames}/>
          </div>
          <div className="col-3">
            <DetailTable
              name={activeDetailName}
              resource={this.getResourceByName(this.state.resources, this.state.nameToCode[activeDetailName])}
            />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-12">
            <SearchBox
              value={searchQuery}
              placeholder={"Search resources..."}
              onChange={this.handleSearch}
              className="my-0"
            />
            <p>Showing resource availability of <b>{totalCount}</b> sites.</p> 
            <SummaryTable
              resources={data}
              sortColumn={sortColumn}
              onSort={this.handleSort}
            />
            <Pagination
              itemsCount={totalCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePageChange}
            />
          </div>
        </div>
      </div>
    );
  }
};

export default Resources;