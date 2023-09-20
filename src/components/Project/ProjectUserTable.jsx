import React, { Component } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import _ from "lodash";
import paginate from "../../utils/paginate";
import { Link } from "react-router-dom";

class ProjectUserTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      content: (user) => (
        <Link to={`/users/${user.uuid}`}>{user.name}</Link>
      )
    },
    { path: "email", label: "Email" },
    { path: "uuid", label: "ID" },
  ];

  state = {
    pageSize: 10,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  reloadPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
      searchQuery
    } = this.state;

    const { users } = this.props;

    const lowercaseQuery = searchQuery.toLowerCase();
    // filter -> sort -> paginate
    let filtered = users.filter(user => (
      user.name.toLowerCase().includes(lowercaseQuery) || user.email.toLowerCase().includes(lowercaseQuery))
    );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const data = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: data };
  };


  handleInputChange = (e) => {
    // if input gets cleared, trigger data reload and reset the search query
    if (this.state.searchQuery !== "" && e.target.value === "") {
      this.setState({ currentPage: 1, searchQuery: "" }, () => {
        this.reloadPageData();
      });
    } else {
      this.setState({ searchQuery: e.target.value});
    }
  };

  handleSearch = () => {
    this.setState({ currentPage: 1 }, () => {
      this.reloadPageData();
    });
  };

  raiseInputKeyDown = (e) => {
    const query = e.target.value;
    if ((e.key === "Enter") && query) {
     this.handleSearch();
    }
  };


  render() {
    const { pageSize, currentPage, sortColumn, searchQuery } = this.state;
    const { totalCount, data } = this.reloadPageData();
    const { canUpdate } = this.props;

    return (
      <div>
        <div className="w-100 input-group mt-3 mb-1">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Filter by user name or email..."}
            value={searchQuery}
            onChange={this.handleInputChange}
            onKeyDown={this.raiseInputKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.handleSearch}
            >
              Filter
            </button>
          </div>
        </div>
        <div className="d-flex flex-row-reverse">
          {`${data.length} results`}.
        </div>
        <Table
          columns={this.columns}
          data={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          size={canUpdate ? "sm" : "md"}
          isSelectable={true}
          onCheck={this.props.onCheckUser}
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

export default ProjectUserTable;