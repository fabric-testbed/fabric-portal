import React from "react";
import KeyCards from "../SshKey/KeyCards";
import withRouter from "../common/withRouter.jsx";
import { getPeopleById } from "../../services/peopleService.js";
import Link from "next/link";
import { toast } from "react-toastify";

class PublicUserProfile extends React.Component {
  state = {
    user: {
      "affiliation": "",
      "email": "",
      "name": "",
      "uuid": "",
      "profile": {
        "bio": "",
        "job": "",
        "pronouns": "",
        "website": "",
        "other_identities": []
      },
      "roles": [],
      "sshkeys": []
    },
    basicRows: [
      { display: "Name", field: "name" },
      { display: "Email", field: "email" },
      { display: "Affiliation", field: "affiliation" },
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
      if (!role.name.includes("approval-committee")){
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
    }

    return { projectRoles, globalRoles }
  }

  parseIdentityStr = (id) => {
    if (id.type === "google_scholar") {
      return (<a
        href={`https://scholar.google.com/citations?user=${id.identity}`}
        target="_blank"
        rel="noreferrer"
        className="me-2"
      >
        <span className="font-monospace">{`Google Scholar [ID: ${id.identity}]`} </span>
        <i className="fa fa-link"></i>
      </a>);
    } else if (id.type === "orcid"){
      return (<a
        href={`https://orcid.org/${id.identity}`}
        target="_blank"
        rel="noreferrer"
      >
        <span className="font-monospace">{`ORCID [ID: ${id.identity}]`}</span>
        <i className="fa fa-link"></i>
      </a>)
    } else {
      return <a
       href={id.identity}
       target="_blank"
       rel="noreferrer">
        <span className="font-monospace">{`Other [Link: ${id.identity}]`}</span>
        <i className="fa fa-link"></i>
      </a>;
    }
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
              {
                user.profile && user.profile["other_identities"] && 
                <tr>
                  <th scope="row">Other Identities</th>
                  <td>
                    {
                      user.profile["other_identities"].length === 0 ?
                      "" :
                      user.profile["other_identities"].map((id, index) => 
                      <span 
                        key={`other-identity-${index}`}
                        className="badge rounded-pill text-bg-light me-2">
                          {this.parseIdentityStr(id)}
                      </span>)
                    }
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
        <div className="mt-4">
          <h2>Project Roles</h2>
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

export default withRouter(PublicUserProfile);