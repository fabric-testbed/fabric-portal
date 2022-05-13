const ServiceTypeTable = props => {
  return (
    <table className="table table-sm">
      <thead>
        <tr>
          <th scope="col">Interfaces</th>
          <th scope="col">Sites</th>
          <th scope="col">Description</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{props.service.numberOfInterfaces}</td>
          <td>{props.service.numberOfSites}</td>
          <td className="service-type-description">{props.service.description}</td>
        </tr>
      </tbody>
    </table>
  );
}

export default ServiceTypeTable ;
