import React, { Component } from "react";
import Table from "../common/Table";

class SummaryTable extends Component {
  columns = [
    {
      path: "name",
      label: "Site Name",
    },
    { path: "status", label: "Status" },
    { path: "totalVM", label: "Total VM" },
    { path: "freeVM", label: "Free VM" },
    { path: "totalGPU", label: "Total GPU" },
    { path: "freeGPU", label: "Free GPU" },
  ];

  render() {
    const { resources, sortColumn, onSort } = this.props;
    return (
      <Table
        columns={this.columns}
        data={resources}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SummaryTable;
