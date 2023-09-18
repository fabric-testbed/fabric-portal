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
  }

  deletedColumn = {
    key: "delete",
    content: (user) => (
      <button
        onClick={() => this.props.onDelete(user)}
        className="btn btn-danger btn-sm"
      >
        Delete
      </button>
    ),
  };

  componentDidMount() {
    if (this.props.canUpdate && this.columns.length <= 3) {
      this.columns.push(this.deletedColumn);
    }
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
    const { pageSize, currentPage, sortColumn } = this.state;
    const { totalCount, data } = this.getPageData();
    const { canUpdate } = this.props;

    return (
      <div>
        <Table
          columns={this.columns}
          data={data}
          sortColumn={sortColumn}
          onSort={this.handleSort}
          size={canUpdate ? "sm" : "md"}
          isSelectable={true}
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