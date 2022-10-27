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
      this.setState({ user });
    } catch (err) {
      toast.error("Failed to load user information.");
    }
  }

  parseRoles = (roles) => {
    // merge multiple roles for the same project as one.
    const projectRoles = {};
    const globalRoles = [];

    const globalRolesMapping = {
      "fabric-active-users": "FABRIC Active User",
      "facility-operators": "Facility Operator",
      "project-leads": "Project Lead",
      "Jupyterhub": "Jupyterhub",
      "portal-admins": "Portal Admin",
    }
    const projectRolesMapping = {
      "-pc": "Project Creator",
      "-po": "Project Owner",
      "-pm": "Project Member"
    }

    for (const role of roles) {
      if (Object.keys(globalRolesMapping).includes(role.name)) {
        globalRoles.push({
          "name": globalRolesMapping[role.name],
          "description": role.description
        })
      } else {
        // project role.
        const projectID = role.name.substring(0, role.name.length - 3);
        const projectRole = projectRolesMapping[role.name.slice(-3)];
        if (!Object.keys(projectRoles).includes(projectID)) {
          projectRoles[projectID] = {
            projectName: role.description,
            projectRoles: projectRole
          };
        } else {
          const r = projectRoles[projectID].projectRoles;
          projectRoles[projectID].projectRoles = `${r} / ${projectRole}`;
        }
      }
    }

    return { projectRoles, globalRoles }
  }

  render() {
    const { user } = this.state;
    const roles = user.roles ? this.parseRoles(user.roles) : [];

    return (
      <div className="container">
        <h1>Public User Profile - {user.name}</h1>
        <div className="mt-4">
          <h2>Basic Information</h2>
          <table className="table table-sm table-striped table-bordered mb-4">
            <tbody>
              {this.state.basicRows.map((row, index) => {
                return (
                  user[row.field] && 
                  <tr key={`account-info-${index}`}>
                    <th scope="row">{row.display}</th>
                    <td>{user[row.field]}</td>
                  </tr>
                );
              })}
              {
                user.profile && this.state.profileRows.map((row, index) => {
                  return (
                      user.profile[row.field] && 
                      <tr key={`account-info-${index}`}>
                        <th scope="row">{row.display}</th>
                        <td>{user.profile[row.field]}</td>
                      </tr>
                  );
                })
              }
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2>Roles</h2>
          {
            roles.globalRoles &&
             <table className="table table-sm table-striped table-bordered mb-4">
              <tbody>
                <tr>
                  <th>Global Roles</th>
                  <th>Description</th>
                </tr>
                {
                  roles.globalRoles.map((role, index) => {
                    return (
                      <tr key={`global-role-${index}`}>
                        <td>{role.name}</td>
                        <td>{role.description}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          }
          {
            roles.projectRoles && roles.projectRoles !== null &&  
             <table className="table table-sm table-striped table-bordered my-4">
              <tbody>
                <tr>
                  <th>Project</th>
                  <th>Roles</th>
                </tr>
                {
                  Object.keys(roles.projectRoles).map((projectID, index) => {
                    return (
                      <tr key={`project-role-${index}`}>
                        <td>
                          <Link to={`/projects/${projectID}`}>
                            {roles.projectRoles[projectID].projectName}
                          </Link>
                        </td>
                        <td>{roles.projectRoles[projectID].projectRoles}</td>
                      </tr>
                    );
                  })
                }
              </tbody>
            </table>
          }
          {
            !user.roles &&
            <div className="alert alert-primary mb-2" role="alert">
              The user sets <b>Roles</b> as private information.
            </div>
          }
          {
            user.roles && user.roles.length === 0 &&
            <div className="alert alert-primary mb-2" role="alert">
              The user doesn't have any role.
            </div>
          }
        </div>
        <div className="mt-4">
          <h2>SSH Keys</h2>
          {
            !user.sshkeys &&
            <div className="alert alert-primary mb-2" role="alert">
              The user sets <b>SSH Keys</b> as private information.
            </div>
          }
          {
            user.sshkeys && user.sshkeys.length === 0 &&
            <div className="alert alert-primary mb-2" role="alert">
              The user doesn't have any sliver key.
            </div>
          }
          {
            user.sshkeys && user.sshkeys.length > 0 &&
            <KeyCards keys={user.sshkeys} disableKeyDelete={true} />
          }
        </div>
      </div>
    );
  }
}

export default PublicUserProfile;