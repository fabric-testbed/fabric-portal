import React, { Component } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import _ from "lodash";
import paginate from "../../utils/paginate";
import { Link } from "react-router-dom";

class ProjectUserTable extends Component {
  columns = [
    {
      path: "isChecked",
      label: "",
      content: (user) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={`tableCheck${user.uuid}`}
            checked={user.isChecked}
            onClick={() => this.handleCheckUser(user.uuid)}
          />
        </div>
      )
    },
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
    pageSize: 5,
    currentPage: 1,
    sortColumn: { path: "name", order: "asc" },
    searchQuery: "",
    checkedUserIDs: []
  }

  handleCheckUser = (userID) => {
    const userIDs = [...this.state.checkedUserIDs];
    userIDs.push(userID);
    this.setState({ checkedUserIDs: userIDs });
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
      searchQuery,
      checkedUserIDs
    } = this.state;

    const { users } = this.props;

    const lowercaseQuery = searchQuery.toLowerCase();
    // filter -> sort -> paginate
    let filtered = users.filter(user =>  user.email ?
      (user.name.toLowerCase().includes(lowercaseQuery) || user.email.toLowerCase().includes(lowercaseQuery))
      :
      user.name.toLowerCase().includes(lowercaseQuery)
    );

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    // add the isChecked property based on checked users.
    // render the table checkbox based on is checked or not.
    const checked = sorted.map(user =>  ({ ...user, isChecked: checkedUserIDs.includes(user.uuid) }));

    const data = paginate(checked, currentPage, pageSize);

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
    const { pageSize, currentPage, sortColumn, searchQuery, checkedUserIDs } = this.state;
    const { totalCount, data } = this.reloadPageData();
    const { canUpdate, personnelType } = this.props;

    return (
      <div>
        <div className="w-100 input-group my-1">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={`Filter ${personnelType}...`}
            value={searchQuery}
            onChange={this.handleInputChange}
            onKeyDown={this.raiseInputKeyDown}
          />
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
          onCheck={this.props.onCheckUser}
        />
        <Pagination
          itemsCount={totalCount}
          pageSize={pageSize}
          currentPage={currentPage}
          onPageChange={this.handlePageChange}
        />
        <button
          onClick={() => this.props.onDeleteUsers(personnelType, checkedUserIDs)}
          className="btn btn-sm btn-outline-danger"
          disabled={checkedUserIDs.length === 0}
        >
          Remove from {personnelType}
        </button>
      </div>
    );
  }
}

export default ProjectUserTable;