import React, { Component } from "react";
import Table from "../common/Table";
import { Link } from "react-router-dom";

class SummaryTable extends Component {
  columns = [
    {
      content: (resource) => (
        <div>
          <Link
            to={
            {
              pathname:`/sites/${resource.id}`,
              state: { siteData: resource }
            }
          }>
            {resource.name}
          </Link>
          {
            resource.status && resource.status.state === "Maint" &&
            <div>
              <span className="badge badge-pill badge-danger px-2">
                Maintenance
              </span>
            </div>
          }
          {
            resource.status && resource.status.state === "PreMaint" &&
            <div>
              <span className="badge badge-pill badge-info px-2">
                Pre-Maintenance
              </span>
            </div>
          }
        </div>
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
