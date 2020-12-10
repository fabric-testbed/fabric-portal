import React from "react";
import { getCurrentUser } from "../../services/prPeopleService.js";
import { getGlobalRoles} from "../../services/prPeopleService.js";

class MyRoles extends React.Component {
  state = {
    user: {},
    projectRoleCols: [
      { display: "Description", field: "description" },
      { display: "Facility", field: "facility" },
      { display: "Project Member", field: "is_project_member" },
      { display: "Project Owner", field: "is_project_owner" },
    ],
  };

  async componentDidMount(){
    const { data: user } = await getCurrentUser();
    this.setState({ user });
  }
  
  checkProjectRole(projectID, role) {
    let role_str = projectID + "-" + role;
    return this.state.user["roles"].includes(role_str);
  }

  getMyProjects() {
    const myProjects = [];
    for (const p of this.state.user["projects"]) {
      const is_project_member = this.checkProjectRolep(p["uuid"],"pm");
      const is_project_owner = this.checkProjectRole(p["uuid"],"po");
      const roles = { is_project_member, is_project_member };
      myProjects.push({ ...p, ...roles });
    }
    return myProjects;
  }

  renderRoleTableFields(param) {
    // boolean: show check icon for true and times icon for false;
    // string: only show the first 20 words to keep UI succinct if it's too long;
    // array (object): show elements separated by space;
    // for tags: add style to each tag;
    switch (typeof param) {
      case "boolean":
        return param === true ? (
          <i className="fa fa-check text-success"></i>
        ) : (
          <i className="fa fa-times text-danger"></i>
        );
      case "string":
        return param.length > 100
          ? param.split(" ").slice(0, 20).join(" ").concat(" ...")
          : param;
      default:
        return param;
    }
  }

  render() {
    return (
      <div className="col-9">
        <h1>My Roles</h1>
        <h4 className="mt-4">Global Roles</h4>
        <table className="table table-striped table-bordered my-4 w-50">
          <tbody>
            <tr>
              <td>Project Lead</td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  this.state.user["roles"].includes("project-leads")
                )}
              </td>
            </tr>
            <tr>
              <td>Facility Operator</td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  this.state.user["roles"].includes("facility-operator")
                )}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-4">Project Roles</h4>
        <table className="table table-striped table-bordered my-4 text-center">
          <tbody>
            <tr>
              <th>Project Name</th>
              {this.state.projectRoleCols.map((col, index) => {
                return (
                  <th key={`project-role-header-${index}`}>{col.display}</th>
                );
              })}
            </tr>
            {this.getMyProjects().map((row, index) => {
              return (
                <tr key={`project-role-row-${index}`}>
                  <td>
                    <a
                      href={row.project_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {row.name}
                    </a>
                  </td>
                  {this.state.projectRoleCols.map((col, index) => {
                    return (
                      <td key={`project-role-col-${index}`}>
                        {this.renderRoleTableFields(row[col.field])}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MyRoles;