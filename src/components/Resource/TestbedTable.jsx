import React, { Component } from "react";

class TestbedTable extends Component {
  columns = [
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
    const { sum } = this.props;
    return (
      <table className="table table-sm table-bordered mx-3 mt-2 text-center">
      <thead className="thead-light">
        <tr>
          <td colSpan="8"><b>Testbed Resource Summary</b></td>
        </tr>
        <tr>
          {
            this.columns.map((col, index) => {
              return (
                <td key={`testbed-table-header-${index}`}>{col.label}</td>
              )
            })
          }
        </tr>
      </thead>
      <tbody className="table-primary">
        <tr>
        {
            this.columns.map((col, index) => {
              return (
                <td key={`testbed-table-body-${index}`}>
                  {sum[col.path[0]] >= 0 ? `${sum[col.path[0]]} / ${sum[col.path[1]]}` : `loading...`}
                </td>
              )
            })
          }
        </tr>
      </tbody>
    </table>
    );
  }
}

export default TestbedTable;
