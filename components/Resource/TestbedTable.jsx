import React from "react";

const columns = [
  { path: ["freeCore", "totalCore"], label: "Cores" },
  { path: ["freeDisk", "totalDisk"], label: "Disk(GB)" },
  { path: ["freeRAM", "totalRAM"], label: "RAM(GB)" },
  { path: ["freeGPU", "totalGPU"], label: "GPU" },
  { path: ["freeNVME", "totalNVME"], label: "NVME" },
  { path: ["freeSmartNIC", "totalSmartNIC"], label: "SmartNIC" },
  { path: ["freeSharedNIC", "totalSharedNIC"], label: "SharedNIC" },
  { path: ["freeFPGA", "totalFPGA"], label: "FPGA" },
  { path: ["freeSwitch", "totalSwitch"], label: "Switch" }
];

function TestbedTable({ sum }) {
  return (
    <table className="table table-sm table-bordered mx-3 mt-2 text-center">
    <thead className="thead-light">
      <tr>
        <td colSpan="9"><b>Testbed Resource Summary</b></td>
      </tr>
      <tr>
        {
          columns.map((col, index) => {
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
          columns.map((col, index) => {
            return (
              <td key={`testbed-table-body-${index}`}>
                {sum[col.path[0]] >= 0 ? `${sum[col.path[0]]} / ${sum[col.path[1]]}` : `N/A`}
              </td>
            )
          })
        }
      </tr>
    </tbody>
  </table>
  );
}

export default TestbedTable;
