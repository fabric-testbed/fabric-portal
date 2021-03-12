import ProgressBar from 'react-bootstrap/ProgressBar';

const DetailTable = props => {
  return (
    <div>
      <table className="table">
        <thead>
          <tr>
            <th scope="col" colSpan="2" className="text-center">Starlight</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td scope="col">Status</td>
            <td className="align-middle text-center">
              <span className="badge badge-pill badge-success px-2">Up</span>
            </td>
          </tr>
          <tr>
            <td scope="row">VM</td>
            <td className="align-middle"><ProgressBar variant="success" now={85} label={"85%"} /></td>
          </tr>
          <tr>
            <td scope="row">GPU</td>
            <td className="align-middle"><ProgressBar variant="success" now={85} label={"60%"} /></td>
          </tr>
          <tr>
            <td scope="row">VM</td>
            <td className="align-middle"><ProgressBar variant="success" now={50} label={"50%"} /></td>
          </tr>
          <tr>
            <td scope="row">GPU</td>
            <td className="align-middle"><ProgressBar variant="danger" now={100} label={"100%"} /></td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default DetailTable;