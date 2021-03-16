import React, { Component } from "react";
import Table from "../common/Table";

class SummaryTable extends Component {
  columns = [
    {
      path: "name",
      label: "Site Name",
    },
    { path: "totalCores", label: "Total Cores" },
    { path: "freeCores", label: "Free Cores" },
    { path: "totalGPUs", label: "Total GPUs" },
    { path: "freeGPUs", label: "Free GPUs" },
    { path: "totalNICs", label: "Total NICs" },
    { path: "freeNICs", label: "Free NICs" },
    { path: "totalNVMEs", label: "Total NVMEs" },
    { path: "freeNVMEs", label: "Free NVMEs" },
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
