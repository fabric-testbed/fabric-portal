import React, { Component } from "react";
import Table from "../common/Table";

class SummaryTable extends Component {
  columns = [
    {
      path: "name",
      label: "Site Name",
    },
    { path: ["freeCore", "totalCore"], label: "Core" },
    { path: ["freeCPU", "totalCPU"], label: "CPU" },
    { path: ["freeDisk", "totalDisk"], label: "Disk" },
    { path: ["freeRAM", "totalRAM"], label: "RAM" },
    { path: ["freeUnit", "totalUnit"], label: "Unit" },
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