import React, { Component } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import _ from "lodash";
import paginate from "../../utils/paginate";
import { Link } from "react-router-dom";

class ProjectTokenHolders extends Component {
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
  }

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  handlePageChange = (page) => {
    this.setState({ currentPage: page });
  };

  getPageData = () => {
    const {
      pageSize,
      currentPage,
      sortColumn,
    } = this.state;

    const { users } = this.props;

    // filter -> sort -> paginate
    let filtered = users;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const data = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: data };
  };

  render() {
    const { token_holders } = this.props;
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div>
        <h4>Project Members with Long-lived Token Access</h4>
        {
          token_holders && token_holders.length > 0 &&
          <div className="mt-2">
            <div className="d-flex flex-row justify-content-between mb-2">
              <span>{`${token_holders.length} users`}.</span>
            </div>
              <Table
                columns={this.columns}
                data={data}
                sortColumn={sortColumn}
                onSort={this.handleSort}
                size={"md"}
              />
              <Pagination
                itemsCount={totalCount}
                pageSize={pageSize}
                currentPage={currentPage}
                onPageChange={this.handlePageChange}
              />
          </div>
        }
        {
          token_holders && token_holders.length === 0 && 
          <div className="alert alert-primary" role="alert">
            {`This project has no member with long-lived token access.`}
          </div>
        }
      </div>
    );
  }
}

export default ProjectTokenHolders;