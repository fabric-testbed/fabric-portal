import React from "react";

const visibleRows = [
  { display: "Affiliation", field: "affiliation" },
  { display: "FABRIC ID", field: "fabric_id" },
  { display: "Bastion Login", field: "bastion_login" },
  { display: "UUID", field: "uuid" },
  { display: "CILogon ID", field: "cilogon_id"}
];

function AccountInfo({ user }) {
  return (
    <table className="table table-striped table-bordered my-4">
      <tbody>
        {visibleRows.map((row, index) => (
          <tr key={`account-info-${index}`}>
            <th scope="row">{row.display}</th>
            <td>{user[row.field]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default AccountInfo;
