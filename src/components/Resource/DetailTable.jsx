import ProgressBar from '../common/ProgressBar';
import { sitesNameMapping }  from "../../data/sites";
import { Link } from "react-router-dom";

const generateProgressBar = (total, free, color, labelColor) => {
  return (
    <ProgressBar
      now={total > 0 ? Math.round(free * 100/ total) : 0}
      label={`${free}/${total}`}
      color={color}
      labelColor={labelColor}
    />
  )
}

const DetailTable = props => {
  const {name, resource, parent} = props;
  const rows = [
    ["Cores", "totalCore", "freeCore"],
    ["Disk (GB)", "totalDisk", "freeDisk"],
    ["RAM (GB)", "totalRAM", "freeRAM"],
    ["GPU", "totalGPU", "freeGPU"],
    ["NVME", "totalNVME", "freeNVME"],
    ["SmartNIC", "totalSmartNIC", "freeSmartNIC"],
    ["SharedNIC", "totalSharedNIC", "freeSharedNIC"],
    ["FPGA", "totalFPGA", "freeFPGA"],
  ]

  const statusMapping = {
    "Maint": {
      state: "Maintenance",
      colorName: "danger",
      colorHex: "#b00020",
      labelColorHex: "#fff"
    },
    "PreMaint": {
      state: "Pre-Maintenance",
      colorName: "info",
      colorHex: "#ffb670",
      labelColorHex: "#212529"
    },
    "Active": {
      state: "Active",
      colorName: "primary",
      colorHex: "#68b3d1",
      labelColorHex: "#212529"
    }
  }

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" colSpan="2" className="text-center">
              {
                !resource && parent !== "sitepage" && 
                `${sitesNameMapping.shortNameToAcronym[name]} (${sitesNameMapping.shortToLongName[name]})`
              }
              {
                !resource && parent === "sitepage" &&
                `${sitesNameMapping.acronymToShortName[name]} (${sitesNameMapping.acronymToLongName[name]})`
              }
              {
                resource && parent !== "sitepage" && 
                <Link
                  to={
                    {
                      pathname:`/sites/${resource.id}`,
                      state: { siteData: resource }
                    }
                  }>
                  {`${sitesNameMapping.shortNameToAcronym[name]} (${sitesNameMapping.shortToLongName[name]})`}
                </Link>
              }
              {
                resource && parent === "sitepage" && sitesNameMapping.acronymToShortName[name] && 
                <Link
                  to={
                    {
                      pathname:`/sites/${resource.id}`,
                      state: { siteData: resource }
                    }
                  }>
                  {`${sitesNameMapping.acronymToShortName[name]} (${sitesNameMapping.acronymToLongName[name]})`}
                </Link>
              }
              {
                resource && parent === "sitepage" && !sitesNameMapping.acronymToShortName[name] && name
              }
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Status</td>
            <td className="align-middle text-center">
              {
                !resource &&
                <span className="badge badge-pill badge-secondary px-2">
                  Down
                </span>
              }
              {
                resource &&
                <span
                  className={`badge badge-pill badge-${statusMapping[resource.status.state].colorName} px-2`}
                >
                  { statusMapping[resource.status.state].state }
                </span>
              }
            </td>
          </tr>
          {
            resource && rows.map((row, index) => {
              return (
                <tr key={`resource-detail-${index}`}>
                  <td>{row[0]}</td>
                  <td className="align-middle w-75">
                    {
                     generateProgressBar(resource[row[1]],
                      resource[row[2]],
                      statusMapping[resource.status.state].colorHex,
                      statusMapping[resource.status.state].labelColorHex)
                    }
                  </td>
                </tr>
            )
            })
          }
        </tbody>
      </table>
    </div>
  )
}

export default DetailTable;
