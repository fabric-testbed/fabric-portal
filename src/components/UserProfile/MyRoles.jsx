import React from "react";
import { getUserInfo } from "../../services/fakeUserInformation.js";
import { getProject } from "../../services/fakeProjectInformation.js";

class MyRoles extends React.Component {
  state = {
    user: getUserInfo(),
    projectRoleCols: [
      { display: "Project Name", field: "name" },
      { display: "Description", field: "description" },
      { display: "Tags", field: "tags" },
      { display: "Is Project Member", field: "is_project_member" },
      { display: "Is Project Owner", field: "is_project_owner" },
    ],
  };

  getMyProjects() {
    // fetch project full information by project id.
    const myProjects = [];
    for (const role of this.state.user.project_roles) {
      // concatenate project info and user role objects
      myProjects.push({ ...getProject(role.project_id), ...role });
    }
    console.log(myProjects);
    return myProjects;
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
              <td>
                {this.state.user.global_roles.is_project_lead ? "yes" : "no"}
              </td>
            </tr>
            <tr>
              <td>Facility Operator</td>
              <td>
                {this.state.user.global_roles.is_facility_operator
                  ? "yes"
                  : "no"}
              </td>
            </tr>
          </tbody>
        </table>

        <h4 className="mt-4">Project Roles</h4>
        <table className="table table-striped table-bordered my-4">
          <tbody>
            <tr>
              {this.state.projectRoleCols.map((col, index) => {
                return (
                  <th key={`project-role-header-${index}`}>{col.display}</th>
                );
              })}
            </tr>
            {this.getMyProjects().map((row, index) => {
              return (
                <tr key={`project-role-row-${index}`}>
                  {this.state.projectRoleCols.map((col, index) => {
                    return (
                      <td key={`project-role-col-${index}`}>
                        {row[col.field]}
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
