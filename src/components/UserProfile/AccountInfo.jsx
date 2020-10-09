import React from "react";
import { getUserInfo } from "../../services/fakeUserInformation.js";

class AccountInfo extends React.Component {
  state = {
    user: getUserInfo(),
    visibleRows: [
      { display: "Name", field: "full_name" },
      { display: "Email", field: "email" },
      { display: "Affiliation", field: "affliation" },
    ],
    toggledRows: [
      { display: "EPPN", field: "eppn" },
      { display: "CILogon ID", field: "cilogon_id" },
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
                  <td>{this.state.user[row.field]}</td>
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
          aria-expanded="false"
          aria-controls="moreAccountInfo"
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
                    <td>{this.state.user[row.field]}</td>
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
