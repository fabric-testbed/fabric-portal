import React from "react";
import { getUserInfo } from "../../services/fakeUserInformation.js";

class AccountInfo extends React.Component {
  state = {
    user: getUserInfo(),
    visibleRows: [
      { display: "Name", field: "full_name" },
      { display: "Email", field: "email" },
      { display: "CILogon ID", field: "cilogon_id" },
    ],
  };

  render() {
    return (
      <div className="col-9">
        <h1>Account Information</h1>
        <table className="table table-striped mt-4">
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
      </div>
    );
  }
}

export default AccountInfo;
