import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";

class KeysTable extends Component {
  columns = [
      { path: "name", label: "Name" },
      { path: "type", label: "Type" },
      { path: "id", label: "ID" },
      { path: "create_date", label: "Create Date" },
      { path: "expire_date", label: "Expire Date" },
    ];

  render() {
    const { keys, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={keys}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default KeysTable;