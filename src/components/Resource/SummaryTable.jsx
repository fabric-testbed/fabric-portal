import React, { Component } from "react";
import Table from "../common/Table";

class SummaryTable extends Component {
  columns = [
    {
      path: "name",
      label: "Site Name",
    },
    { path: ["freeCores", "totalCores"], label: "Cores" },
    { path: ["freeGPUs", "totalGPUs"], label: "GPUs" },
    { path: ["freeNICs", "totalNICs"], label: "NICs" },
    { path: ["freeNVMEs", "totalNVMEs"], label: "NVMEs" },
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
