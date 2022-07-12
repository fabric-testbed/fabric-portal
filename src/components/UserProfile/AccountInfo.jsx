import React from "react";

class AccountInfo extends React.Component {
  state = {
    visibleRows: [
      { display: "Name", field: "cilogon_name" },
      { display: "Email", field: "email" },
    ],
    toggledRows: [
      { display: "Affiliation", field: "affiliation" },
      { display: "FABRIC ID", field: "fabric_id" },
      { display: "Bastion Login", field: "bastion_login" },
      { display: "EPPN", field: "eppn" },
      { display: "UUID", field: "uuid" },
      { display: "CILogon ID", field: "cilogon_id"},
    ],
  };

  render() {
    return (
      <div className="col-9">
        <h1>Account Information</h1>
        <table className="table table-striped table-bordered my-4">
          <tbody>
            {this.state.visibleRows.map((row, index) => {
              return (
                <tr key={`account-info-${index}`}>
                  <th scope="row">{row.display}</th>
                  <td>{this.props.user[row.field]}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h6
          id="accountInfoToggle"
          className="card-header my-4"
          data-toggle="collapse"
          data-target="#moreAccountInfo"
          aria-controls="moreAccountInfo"
          aria-expanded="false"
        >
          Additional Information
          <span className="attributes-collapse pull-right">
            <i className="fa fa-plus"></i>
            <i className="fa fa-minus"></i>
          </span>
        </h6>
        <div
          id="moreAccountInfo"
          className="collapse"
          aria-labelledby="moreAccountInfo"
        >
          <table className="table table-striped table-bordered">
            <tbody>
              {this.state.toggledRows.map((row, index) => {
                return (
                  <tr key={`account-info-${index}`}>
                    <th scope="row">{row.display}</th>
                    <td>{this.props.user[row.field]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

export default AccountInfo;