import React, { Component } from "react";
import Table from "../common/Table";
import Link from "next/link";

class SummaryTable extends Component {
  columns = [
    {
      content: (resource) => (
        <div>
          <Link
            to={`/sites/${resource.name}`}
            state={{ data: resource }}
          >
            <span className="font-monospace">{resource.name}</span>
          </Link>
          {
            resource.status && resource.status.state === "Maint" &&
            <div>
              <span className="badge bg-danger px-2">
                Maintenance
              </span>
            </div>
          }
          {
            resource.status && resource.status.state === "PreMaint" &&
            <div>
              <span className="badge bg-warning px-2">
                Pre-Maintenance
              </span>
            </div>
          }
          {
            resource.status && resource.status.state === "PartMaint" &&
            <div>
              <span className="badge bg-warning px-2">
                Partial Maintenance
              </span>
            </div>
          }
        </div>
      ),
      path: "name",
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
    { path: ["freeSwitch", "totalSwitch"], label: "Switch" }
  ];

  render() {
    const { resources, sortColumn, onSort, totalCount, value, onChange } = this.props;
    return (
      <div>
        <div className="d-flex flex-row justify-content-between p-2">
          <div className="fw-bold font-monospace d-flex align-items-center">
            Sites ({totalCount})
          </div>
          <div className="d-flex flex-row w-50 justify-content-end">
            <div className="d-flex flex-row w-50">
              <input
                type="text"
                name="query"
                className="form-control form-control form-control-sm align-self-end"
                placeholder={"Search by site name"}
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div className="mx-2 mb-2 p-2 pb-1 d-flex flex-row justify-content-between bg-light rounded font-monospace">
          <div className="w-50">Component Available:</div>
          <div className="w-75 d-flex flex-row justify-content-between">
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="GPUCheckbox" value="GPU" onChange={(e) => this.props.onFilter(e)}/>
              <label className="form-check-label" for="GPUCheckbox">GPU</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="NVMECheckbox" value="NVME" onChange={(e) => this.props.onFilter(e)}/>
              <label className="form-check-label" for="NVMECheckbox">NVME</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="SmartNICCheckbox" value="SmartNIC" onChange={(e) => this.props.onFilter(e)}/>
              <label className="form-check-label" for="SmartNICCheckbox">SmartNIC</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="SharedNICCheckbox" value="SharedNIC" onChange={(e) => this.props.onFilter(e)}/>
              <label className="form-check-label" for="SharedNICCheckbox">SharedNIC</label>
            </div>
            <div className="form-check form-check-inline">
              <input className="form-check-input" type="checkbox" id="FPGACheckbox" value="FPGA" onChange={(e) => this.props.onFilter(e)} />
              <label className="form-check-label" for="FPGACheckbox">FPGA</label>
            </div>
          </div>
        </div>
        <div className="px-2 pb-1">
          <Table
            columns={this.columns}
            data={resources}
            sortColumn={sortColumn}
            onSort={onSort}
            tStyle={"table-md"}
          />
        </div>
      </div>
    );
  }
}

export default SummaryTable;
