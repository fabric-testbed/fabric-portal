import React from "react";
import Pagination from "../common/Pagination";
import SearchBox from "../common/SearchBox";
import KeysTable from "./KeysTable";

import { Link } from "react-router-dom";

import { getKeys } from "../../services/fakeSSHKeys.js";

import paginate from "../../utils/paginate";
import _ from "lodash";

class Keys extends React.Component {
  state = {
    keys: getKeys(),
    allKeys: getKeys(),
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    sortColumn: { path: "name", order: "asc" },
  };

  async componentDidMount() {

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

  handleKeyGenerate = () => {

  }

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery,
      keys: allKeys,
    } = this.state;

    // filter -> sort -> paginate
    let filtered = allKeys;
    if (searchQuery) {
      filtered = allKeys.filter((k) =>
        k.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const keys = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: keys };
  };

  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div className="col-9">
        <div className="d-flex flex-row justify-content-between">
          <h1>SSH Keys</h1>
          <Link to="/experiments#sshKeys">
            <button
              className="btn btn-sm btn-outline-primary my-3"
            >
              <i className="fa fa-sign-in mr-2"></i>
              Go to Key Management
            </button>
          </Link>
        </div>
        <div className="toolbar">
          <SearchBox
            value={searchQuery}
            placeholder={"Search SSH Keys by Name..."}
            onChange={this.handleSearch}
            className="my-0"
          />
        </div>
        <div className="my-2">
          Showing {totalCount} keys.
        </div>
        <KeysTable
          keys={data}
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
    );
  }
}

export default Keys;