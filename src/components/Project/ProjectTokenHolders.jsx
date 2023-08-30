import React, { Component } from "react";
import Table from "../common/Table";
import Pagination from "../common/Pagination";
import _ from "lodash";
import paginate from "../../utils/paginate";
import { Link } from "react-router-dom";
import { default as portalData } from "../../services/portalData.json";

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

    const { token_holders } = this.props;

    // filter -> sort -> paginate
    let filtered = token_holders;

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const data = paginate(sorted, currentPage, pageSize);

    return { totalCount: filtered.length, data: data };
  };

  render() {
    const { token_holders, urlSuffix, isTokenOwner } = this.props;
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data } = this.getPageData();

    return (
      <div>
        <h4>Project Members with Long-lived Token Access</h4>
        {
          token_holders && token_holders.length > 0 &&
          <div className="mt-3">
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
          <div className="alert alert-primary mt-3" role="alert">
            {`This project has no members with long-lived token access.`}
          </div>
        }
        {
          !isTokenOwner && <button
            className="btn btn-sm btn-outline-success mr-2 my-3"
            onClick={() => window.open(
              `${portalData.jiraLinks.longlivedTokenRequest}?${urlSuffix}`,
              "_blank")
            }
          >
            <i className="fa fa-sign-in mr-2"></i>
            Request Long-lived Token Access
          </button>
        }
      </div>
    );
  }
}

export default ProjectTokenHolders;