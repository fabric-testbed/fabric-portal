import React, { Component } from "react";

class TestbedTable extends Component {
  columns = [
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
                <td key={`testbed-table-body-${index}`}>{sum[col.path]}</td>
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

