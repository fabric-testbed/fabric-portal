import React, { Component } from "react";
import Table from "../common/Table";
import { Link } from "react-router-dom";

class SummaryTable extends Component {
  columns = [
    {
      content: (resource) => (
        <Link to={`/sites/${resource.id}`}>
          {resource.name}
        </Link>
      ),
      label: "Site",
    },
    { path: ["freeCore", "totalCore"], label: "Cores" },
    { path: ["freeDisk", "totalDisk"], label: "Disk(GB)" },
    { path: ["freeRAM", "totalRAM"], label: "RAM(GB)" },
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
        size={"md"}
      />
    );
  }
}

export default SummaryTable;
