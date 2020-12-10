import React from "react";
import { getWhoAmI } from "../../services/userInformationService.js";

class AccountInfo extends React.Component {
  state = {
    user: {},
    visibleRows: [
      { display: "Name", field: "name" },
      { display: "Email", field: "email" },
    ],
    toggledRows: [
      { display: "EPPN", field: "eppn" },
      { display: "UUID", field: "uuid" },
      { display: "CILogon ID", field: "oidc_claim_sub"},
    ],
  };

  async componentDidMount(){
    const { data: user } = await getWhoAmI();
    localStorage.setItem("userID", user.uuid);
    this.setState({ user });
  }

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