import React from "react";

class AccountInfo extends React.Component {
  state = {
    visibleRows: [
      { display: "CILogon Name", field: "cilogon_name" },
      { display: "CILogon Email", field: "cilogon_email" },
      { display: "Affiliation", field: "affiliation" },
      { display: "FABRIC ID", field: "fabric_id" },
      { display: "Bastion Login", field: "bastion_login" },
      { display: "EPPN", field: "eppn" },
      { display: "UUID", field: "uuid" },
      { display: "CILogon ID", field: "cilogon_id"}
    ]
  };

  render() {
    const { user } = this.props;
    return (
      <table className="table table-striped table-bordered my-4">
        <tbody>
          {this.state.visibleRows.map((row, index) => {
            return (
              <tr key={`account-info-${index}`}>
                <th scope="row">{row.display}</th>
                <td>{user[row.field]}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  }
}

export default AccountInfo;