import ProgressBar from 'react-bootstrap/ProgressBar';

const generateProgressBar = (total, free) => {
  return (
    <ProgressBar
      variant="success"
      now={Math.floor(free * 100 / total)}
      label={`${free}/${total}`}
    />
  )
}

const DetailTable = props => {
  const {name, resource} = props;
  const rows = [
    ["Core", "totalCore", "freeCore"],
    ["CPU", "totalCPU", "freeCPU"],
    ["Disk", "totalDisk", "freeDisk"],
    ["RAM", "totalRAM", "freeRAM"],
    ["Unit", "totalUnit", "freeUnit"],
  ]
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" colSpan="2" className="text-center">{name}</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col">Status</th>
            <td className="align-middle text-center">
              {
                resource ? (
                  <span className="badge badge-pill badge-success px-2">Up</span>
                ) : (<span className="badge badge-pill badge-danger px-2">Down</span>)
              }
              
            </td>
          </tr>
          {
            resource && rows.map((row, index) => {
              return (
                <tr key={`resource-detail-${index}`}>
                  <th scope="row">{row[0]}</th>
                  <td className="align-middle">
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