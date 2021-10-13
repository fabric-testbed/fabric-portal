import React, { Component } from "react";
import Table from "../common/Table";

class SummaryTable extends Component {
  columns = [
    {
      path: "name",
      label: "Site",
    },
    { path: ["freeCore", "totalCore"], label: "Core" },
    { path: ["freeDisk", "totalDisk"], label: "Disk" },
    { path: ["freeRAM", "totalRAM"], label: "RAM" },
    { path: ["freeGPU", "totalGPU"], label: "GPU" },
    { path: ["freeNVME", "totalNVME"], label: "NVME" },
    { path: ["freeSmartNIC", "totalSmartNIC"], label: "SmartNIC" },
    { path: ["freeSharedNIC", "totalSharedNIC"], label: "SharedNIC" },
    { path: ["freeFPGA", "totalFPGA"], label: "FPGA" },
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
