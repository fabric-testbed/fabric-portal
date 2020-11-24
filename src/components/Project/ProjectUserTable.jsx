import React, { Component } from "react";
import Table from "../common/Table";

class ProjectUserTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
    },
    { path: "email", label: "Email" },
    { path: "uuid", label: "ID" },
  ];

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

  constructor() {
    super();
    this.columns.push(this.deletedColumn);
  }

  render() {
    const { users, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={users}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProjectUserTable;
