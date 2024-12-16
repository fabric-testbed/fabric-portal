import React, { Component } from "react";
import Table from "../common/Table";

class FacilityPortTable extends Component {
  columns = [
    {
      content: (fp) => (<span className="font-monospace">{fp.name}</span>),
      path: "name",
      label: "Name",
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
    const { facilityPorts, totalCount } = this.props;
    return (
      <div>
        <div className="d-flex flex-row justify-content-between p-2">
          <div className="fw-bold font-monospace d-flex align-items-center">
            Facility Ports ({totalCount})
          </div>
        </div>
        <div className="px-2 pb-1">
          <Table
            columns={this.columns}
            data={facilityPorts}
            tStyle={"table-sm"}
          />
        </div>
      </div>
    );
  }
}

export default FacilityPortTable;
