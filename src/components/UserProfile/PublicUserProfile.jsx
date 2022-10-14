import React from "react";
import { getPeopleById } from "../../services/peopleService.js";
import { toast } from "react-toastify";

class PublicUserProfile extends React.Component {
  state = {
    user: {
      "affiliation": "",
      "email": "",
      "eppn": "",
      "name": "",
    },
    basicRows: [
      { display: "Name", field: "cilogon_name" },
      { display: "Email", field: "email" },
      { display: "Affiliation", field: "affiliation" },
    ],
    roleColumns: [
      { display: "Description", field: "description" },
      { display: "Name", field: "name" },
    ]
  };

  async componentDidMount() {
    const userId = this.props.match.params.id;

    try {
      const { data: res } = await getPeopleById(userId);
      const user = res.results[0];
      this.setState({ user  });
    } catch (err) {
      toast.error("Failed to load user information.");
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div className="col-9">
        <h1>Basic Information</h1>
        <table className="table table-striped table-bordered my-4">
          <tbody>
            {this.state.basicRows.map((row, index) => {
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

export default PublicUserProfile;