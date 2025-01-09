import React, { Component } from "react";
import Table from "../common/Table";
import CopyButton from "../common/CopyButton";

class FacilityPortTable extends Component {
  columns = [
    {
      content: (fp) => (<span className="font-monospace">
        <CopyButton
          id={fp.name}
          text=""
          showCopiedValue={true}
          btnStyle={"btn btn-sm me-2 btn-outline-primary"}
        />
        {fp.name}
      </span>),
      path: "name",
      label: "Name",
    },
    {
      content: (fp) => (<span className="font-monospace">{fp.site}</span>),
      path: "site",
      label: "Site",
    },
    { 
      content: (fp) => (
        <div className="w-50">
          {
            fp.vlan_range && fp.vlan_range.length > 0 &&
            fp.vlan_range.map((range, index) => 
              <span
                className="font-monospace badge bg-primary me-1"
                key={`vlan-range-${index}`}
              >
                {`[${range}]`}
              </span>
            )
          }
        </div>
      ), 
      path: "vlan_range", 
      label: "VLAN Range"
    },
    {
      content: (fp) => (
        <div className="w-25">
          {
            fp.allocated_vlan_range && fp.allocated_vlan_range.length > 0 &&
            fp.allocated_vlan_range.map((range, index) => 
              <span
                className="font-monospace badge bg-primary"
                key={`allocate-vlan-range-${index}`}
              >
                {`${range}`}
              </span>
            )
          }
        </div>
      ),
      path: "allocated_vlan_range", 
      label: "Allocated VLAN Range"
    }
  ];

  render() {
    const { facilityPorts, totalCount, onChange, value, sortColumn, onSort } = this.props;
    return (
      <div>
        <div className="d-flex flex-row justify-content-between p-2">
        <div className="fw-bold font-monospace d-flex align-items-center">
            Facility Ports ({totalCount})
          </div>
          <div className="d-flex flex-row w-50 justify-content-end">
            <div className="d-flex flex-row w-50">
              <input
                type="text"
                name="query"
                className="form-control form-control form-control-sm align-self-end"
                placeholder={"Search by name or site"}
                value={value}
                onChange={(e) => onChange(e.currentTarget.value)}
              />
            </div>
          </div>
        </div>
        <div className="px-2 pb-1">
          <Table
            columns={this.columns}
            data={facilityPorts}
            tStyle={"table-sm"}
            sortColumn={sortColumn}
            onSort={onSort}
          />
        </div>
      </div>
    );
  }
}

export default FacilityPortTable;
