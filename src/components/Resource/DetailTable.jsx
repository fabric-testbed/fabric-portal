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
    ["Cores", "totalCores", "freeCores"],
    ["GPUs", "totalGPUs", "freeGPUs"],
    ["NICs", "totalNICs", "freeNICs"],
    ["NVMEs", "totalNVMEs", "freeNVMEs"],
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
            <td scope="col">Status</td>
            <td className="align-middle text-center">
              <span className="badge badge-pill badge-success px-2">Up</span>
            </td>
          </tr>
          {
            rows.map((row, index) => {
              return (
                <tr key={`resource-detail-${index}`}>
                  <td scope="row">{row[0]}</td>
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