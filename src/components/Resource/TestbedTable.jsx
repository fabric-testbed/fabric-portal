import React, { Component } from "react";

class TestbedTable extends Component {
  columns = [
    { path: ["freeCore", "totalCore"], label: "Core" },
    { path: ["freeCPU", "totalCPU"], label: "CPU" },
    { path: ["freeDisk", "totalDisk"], label: "Disk" },
    { path: ["freeRAM", "totalRAM"], label: "RAM" },
    { path: ["freeUnit", "totalUnit"], label: "Unit" },
  ];

  render() {
    const { sum } = this.props;
    return (
      <table className="table table-sm table-bordered mx-3 mt-2 text-center">
      <thead>
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
                  {`${sum[col.path[0]]} / ${sum[col.path[1]]}`}
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
