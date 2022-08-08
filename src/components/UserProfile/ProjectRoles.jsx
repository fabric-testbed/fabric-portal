import React from "react";
import _ from "lodash";
import { toast } from "react-toastify";
import { getProjects } from "../../services/projectService.js";
import { Link } from "react-router-dom";

class ProjectRoles extends React.Component {
  state = {
    myProjects: [],
  };

  async componentDidMount(){
    try {
      const { data: res } = await getProjects("myProjects", 0, 20);
      const myProjects = res.results;
      this.setState({ myProjects });
    } catch (ex) { 
      toast.error("Failed to load user's projects'. Please re-login.");
      console.log("Failed to load user's projects: " + ex.response.data);
    }
  }

  renderRoleTableFields(param) {
    switch (typeof param) {
      case "boolean":
        return param === true ? (
          <i className="fa fa-check text-success"></i>
        ) : (
          <i className="fa fa-ban text-danger"></i>
        );
      case "string":
        return _.truncate(param, {
          'length': 100,
          'separator': ' '
        });
      default:
        return param;
    }
  }

  render() {
    const { myProjects } = this.state;
    return (
      <div>
        <h4 className="mt-4">Project Roles</h4>
        <table className="table table-striped table-bordered my-4 text-center">
          <tbody>
            <tr>
              <th>Project Name</th>
              <th>Description</th>
              <th>Facility</th>
              <th>Project Member</th>
              <th>Project Owner</th>
            </tr>
            {
              myProjects.map((project, index) => {
                return (
                  <tr>
                    <td>
                      <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
                    </td>
                    <td>{this.renderRoleTableFields(project.description)}</td>
                    <td>{project.facility}</td>
                    <td>{this.renderRoleTableFields(project.memberships.is_member)}</td>
                    <td>{this.renderRoleTableFields(project.memberships.is_owner)}</td>
                  </tr>
                );
              })
            }
          </tbody>
        </table>
      </div>
    )
  }
}

export default ProjectRoles;