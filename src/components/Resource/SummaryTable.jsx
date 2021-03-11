const SummaryTable = props => {
  return (
    <div>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th scope="col">Availability</th>
            <th scope="col">Site 1</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="col">Status</th>
            <td>Up</td>
          </tr>
          <tr>
            <th scope="row">VM</th>
            <td>2/10</td>
          </tr>
          <tr>
            <th scope="row">GPU</th>
            <td>3/5</td>
          </tr>
          <tr>
            <th scope="row">VM</th>
            <td>2/10</td>
          </tr>
          <tr>
            <th scope="row">GPU</th>
            <td>3/5</td>
          </tr>
        </tbody>
      </table>
    </div>
  )
}

export default SummaryTable;