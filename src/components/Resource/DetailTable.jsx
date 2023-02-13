import ProgressBar from '../common/ProgressBar';
import { sitesNameMapping }  from "../../data/sites";
import { Link } from "react-router-dom";

const generateProgressBar = (total, free) => {
  return (
    <ProgressBar
      now={total > 0 ? Math.round(free * 100/ total) : 0}
      label={`${free}/${total}`}
    />
  )
}

const DetailTable = props => {
  const {name, resource} = props;
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

  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" colSpan="2" className="text-center">
              {
                resource ? 
                <Link to={`/sites/${resource.id}`}>
                  {`${sitesNameMapping.shortNameToAcronym[name]} (${sitesNameMapping.shortToLongName[name]})`}
                </Link> : 
                `${sitesNameMapping.shortNameToAcronym[name]} (${sitesNameMapping.shortToLongName[name]})`
              }
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Status</td>
            <td className="align-middle text-center">
              {
                resource ? (
                  <span className="badge badge-pill badge-primary px-2">Up</span>
                ) : (<span className="badge badge-pill badge-danger px-2">Down</span>)
              }
              
            </td>
          </tr>
          {
            resource && rows.map((row, index) => {
              return (
                <tr key={`resource-detail-${index}`}>
                  <td>{row[0]}</td>
                  <td className="align-middle w-75">
                    {generateProgressBar(resource[row[1]], resource[row[2]])}
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
