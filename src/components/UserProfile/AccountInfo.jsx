import React from "react";

class AccountInfo extends React.Component {
  state = {
    visibleRows: [
      { display: "Name", field: "cilogon_name" },
      { display: "Email", field: "email" },
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
      <div className="col-9">
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
      </div>
    );
  }
}

export default AccountInfo;