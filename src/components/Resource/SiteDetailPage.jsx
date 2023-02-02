import React from "react";
import DetailTable from "./DetailTable";

class SiteDetailPage extends React.Component {
  state = {
    basicRows: [
      { display: "Name", field: "name" },
      { display: "Acronym", field: "acronym" },
      { display: "Status", field: "status" },
      { display: "Hosting Organization", field: "hosting" },
      { display: "Rack Location", field: "rack" },
      { display: "Notes", field: "notes" }
    ],
    site: {
      name: "RENCI",
      status: "Up",
      acronym: "RENC",
      hosting: "University of North Carolina-Chapel Hill",
      rack: "Chapel Hill, NC",
      notes: "Head-node dual-stack (IPv4, IPv6)"
    },
    resource: {
      "id": 377,
      "nodeId": "860c2a10-de1c-45e4-b5fb-af8afb2b1cc5",
      "name": "RENC",
      "capacities": {
          "core": 192,
          "cpu": 6,
          "disk": 14400,
          "ram": 1536,
          "unit": 3
      },
      "allocatedCapacities": {},
      "totalCPU": 6,
      "allocatedCPU": 0,
      "freeCPU": 6,
      "totalCore": 192,
      "allocatedCore": 0,
      "freeCore": 192,
      "totalDisk": 14400,
      "allocatedDisk": 0,
      "freeDisk": 14400,
      "totalRAM": 1536,
      "allocatedRAM": 0,
      "freeRAM": 1536,
      "totalUnit": 3,
      "allocatedUnit": 0,
      "freeUnit": 3,
      "totalGPU": 6,
      "allocatedGPU": 0,
      "freeGPU": 6,
      "totalNVME": 10,
      "allocatedNVME": 0,
      "freeNVME": 10,
      "totalSmartNIC": 4,
      "allocatedSmartNIC": 0,
      "freeSmartNIC": 4,
      "totalSharedNIC": 381,
      "allocatedSharedNIC": 0,
      "freeSharedNIC": 381,
      "totalFPGA": 0,
      "allocatedFPGA": 0,
      "freeFPGA": 0
  }
  };

  // async componentDidMount() {
  //   const siteId = this.props.match.params.id;
  // }

  render() {
    const { site, resource } = this.state;
    return (
      <div className="container">
        <h1>Site - {site.name}</h1>
        <div className="mt-4">
          <h2>Basic Information</h2>
          <table className="table table-sm table-striped table-bordered mb-4">
            <tbody>
              {this.state.basicRows.map((row, index) => {
                return (
                  site[row.field] && 
                  <tr key={`account-info-${index}`}>
                    <th scope="row">{row.display}</th>
                    <td>{site[row.field]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2>Resource Availabilities</h2>
          <DetailTable
            name={site.name}
            resource={resource}
          />
        </div>
      </div>
    );
  }
}

export default SiteDetailPage;