import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import DetailTable from "../components/Resource/DetailTable";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import SummaryTable from "../components/Resource/SummaryTable";
import { getResource, getResourcesSum } from "../services/fakeResources.js";

import { getResources } from "../services/resourcesService.js";
import { toast } from "react-toastify";
import paginate from "../utils/paginate";
import _ from "lodash";

class Resources extends Component {
  state = {
    resources: {},
    sortColumn: { path: "name", order: "asc" },
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    activeDetailName: "StarLight",
  }

  async componentDidMount(){
    try {
      const { data } = await getResources();
      this.setState({ resources: this.siteParser(data) });
      console.log(this.state.resources)
    } catch (ex) {
      toast.error("Failed to load resource information. Please reload this page.");
      console.log("Failed to load resource information: " + ex.response.data);
    }
  }

  siteParser = (data) => {
    let abqm_elements = JSON.parse(data.value.bqm);
    const nodes = abqm_elements.nodes;
    console.log(nodes)
    const parsedSites = [];
    /************ retrieve site data from all nodes. ************/ 
    nodes.forEach(node => {
      if (node.Class === "CompositeNode") {
        const site = {};
        site.id = node.id;
        site.nodeId = node.NodeID;
        site.name = node.Name;
        site.capacities = JSON.parse(node.Capacities);
        site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};
        parsedSites.push(site);
      }
    })
    return parsedSites;
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
        {/* <div className="row my-2">
          <TestbedTable sum={getResourcesSum()} />
        </div>
        <div className="row my-2">
          <div className="col-9">
            <Topomap onChange={this.handleActiveDetailChange} />
          </div>
          <div className="col-3">
            <DetailTable
              name={activeDetailName}
              resource={getResource(1)}
            />
          </div>
        </div> */}
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
