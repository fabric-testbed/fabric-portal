import React from "react";

const columns = [
  { path: ["freeCore",      "totalCore"      ], label: "Cores"     },
  { path: ["freeDisk",      "totalDisk"      ], label: "Disk(GB)"  },
  { path: ["freeRAM",       "totalRAM"       ], label: "RAM(GB)"   },
  { path: ["freeGPU",       "totalGPU"       ], label: "GPU"       },
  { path: ["freeNVME",      "totalNVME"      ], label: "NVME"      },
  { path: ["freeSmartNIC",  "totalSmartNIC"  ], label: "SmartNIC"  },
  { path: ["freeSharedNIC", "totalSharedNIC" ], label: "SharedNIC" },
  { path: ["freeFPGA",      "totalFPGA"      ], label: "FPGA"      },
  { path: ["freeSwitch",    "totalSwitch"    ], label: "Switch"    },
];

function TestbedTable({ sum }) {
  return (
    <div>
      <div className="d-flex flex-row justify-content-between p-2">
        <div className="fw-bold font-monospace d-flex align-items-center">
          Testbed Resource Summary
        </div>
      </div>
      <div className="px-2">
        <table className="table table-hover table-md mb-2">
          <thead>
            <tr>
              {columns.map(({ label }) => (
                <th key={label}>{label}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {columns.map(({ path, label }) => {
                const free  = sum[path[0]];
                const total = sum[path[1]];
                return (
                  <td key={label}>
                    {free >= 0 ? `${free} / ${total}` : "N/A"}
                  </td>
                );
              })}
            </tr>
          </tbody>
          <caption className="font-monospace text-sm-size mt-2 ms-1">
            * EDUKY is a dedicated educational rack and is excluded from this summary — it is not intended for general research use.
          </caption>
        </table>
      </div>
    </div>
  );
}

export default TestbedTable;
