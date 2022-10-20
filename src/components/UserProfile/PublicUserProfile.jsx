import React from "react";
import KeyCards from "../SshKey/KeyCards";
import { getPeopleById } from "../../services/peopleService.js";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

class PublicUserProfile extends React.Component {
  state = {
    user: {
      "affiliation": "",
      "email": "",
      "eppn": "",
      "name": "",
      "uuid": "",
      "profile": {
        "bio": "",
        "job": "",
        "pronouns": "",
        "website": ""
      },
      "roles": [],
      "sshkeys": []
    },
    basicRows: [
      { display: "Name", field: "name" },
      { display: "Email", field: "email" },
      { display: "Affiliation", field: "affiliation" },
      { display: "EPPN", field: "eppn" },
      { display: "UUID", field: "uuid" }
    ],
    profileRows: [
      { display: "Bio", field: "bio" },
      { display: "Pronouns", field: "pronouns" },
      { display: "Job Title", field: "job" },
      { display: "Website", field: "website" }
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

  parseRoleName = (name) => {
    const projectRolesMapping = {
      "-pc": "Project Creator",
      "-po": "Project Owner",
      "-pm": "Project Member"
    }

    const globalRolesMapping = {
      "fabric-active-users": "FABRIC Active User",
      "facility-operators": "Facility Operator",
      "project-leads": "Project Lead",
      "Jupyterhub": "Jupyterhub",
      "portal-admins": "Portal Admin",
    }  

    const role = name.slice(-3);

    if(Object.keys(projectRolesMapping).includes(role)) {
      return [projectRolesMapping[role], name.slice(0, -3)];
    } else {
      return [globalRolesMapping[name], 0];
    }
  }

  render() {
    const { user } = this.state;
    return (
      <div className="container">
        <h1>Public User Profile - {user.name}</h1>
        <div className="mt-4">
          <h2>Basic Information</h2>
          <table className="table table-sm table-striped table-bordered my-4">
            <tbody>
              {this.state.basicRows.map((row, index) => {
                return (
                  <tr key={`account-info-${index}`}>
                    <th scope="row">{row.display}</th>
                    <td>{user[row.field]}</td>
                  </tr>
                );
              })}
               {this.state.profileRows.map((row, index) => {
                return (
                  <tr key={`account-info-${index}`}>
                    <th scope="row">{row.display}</th>
                    <td>{user.profile[row.field]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2>Roles</h2>
          <table className="table table-sm table-striped table-bordered my-4">
            <tbody>
              {user.roles.map((role, index) => {
                return (
                  <tr key={`account-info-${index}`}>
                    <td>{this.parseRoleName(role.name)[0]}</td>
                    <td>
                      {
                        this.parseRoleName(role.name)[1] === 0 ? 
                          role.description : 
                          <Link to={`/projects/${this.parseRoleName(role.name)[1]}`}>{role.description}</Link>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2 className="mb-4">SSH Keys</h2>
          <KeyCards keys={user.sshkeys} disableKeyDelete={true} />
        </div>
      </div>
    );
  }
}

export default PublicUserProfile;