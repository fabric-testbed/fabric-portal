const ErrorMessageAccordion = props => {
  const { state, errors } = props;
  return (
    <div className="alert alert-warning" role="alert">
      <div className="panel-group" id="accordion">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h6
              className="panel-title mb-0"
              data-bs-toggle="collapse"
              data-bs-target="#errorTableCollapse"
            >
             This slice is in <b>{state}</b> state due to the following errors. 
            </h6>
          </div>
          <div id="errorTableCollapse" className="panel-collapse collapse show">
            <div className="panel-body bg-white">
              <table className="table table-bordered table-sm mt-2 mb-0">
                <thead>
                  <tr>
                    <th scope="col">Node</th>
                    <th scope="col">Error Details</th>
                  </tr>
                </thead>
                <tbody>
                  {
                    errors.map(error => (
                      <tr>
                        <td>{error.node_name}</td>
                        <td>{error.error_message}</td>
                      </tr>
                    ))
                  }
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ErrorMessageAccordion;
