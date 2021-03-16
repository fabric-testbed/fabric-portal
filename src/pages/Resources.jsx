import React, {Component} from "react";
import Topomap from "../components/Resource/Topomap";
import TestbedTable from "../components/Resource/TestbedTable";
import DetailTable from "../components/Resource/DetailTable";
import Pagination from "../components/common/Pagination";
import SearchBox from "../components/common/SearchBox";
import SummaryTable from "../components/Resource/SummaryTable";
import { getResources, getResource, getResourcesSum } from "../services/fakeResources.js";

import paginate from "../utils/paginate";
import _ from "lodash";

class Resources extends Component {
  state = {
    resources: getResources(),
    sortColumn: { path: "name", order: "asc" },
    pageSize: 5,
    currentPage: 1,
    searchQuery: "",
    activeDetailName: "StarLight",
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

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

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
