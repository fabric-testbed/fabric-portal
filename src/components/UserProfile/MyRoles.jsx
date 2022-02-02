import React from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { projectLeadRequest, projectLeadDescription, facilityOperatorDescription } from "../../services/portalData.json";

class MyRoles extends React.Component {
  state = {
    projectRoleCols: [
      { display: "Description", field: "description" },
      { display: "Facility", field: "facility" },
      { display: "Project Member", field: "is_project_member" },
      { display: "Project Owner", field: "is_project_owner" },
    ],
  };

  checkProjectRole = (projectID, role) => {
    let role_str = projectID + "-" + role;
    if (this.props.people) {
      return this.props.people.roles.indexOf(role_str) > -1;
    }
  };

  getMyProjects = () => {
    const myProjects = [];
    if (this.props.people) { 
      for (const p of this.props.people.projects) {
        const is_project_member = this.checkProjectRole(p.uuid,"pm");
        const is_project_owner = this.checkProjectRole(p.uuid,"po");
        const roles = { is_project_member, is_project_owner };
        myProjects.push({ ...p, ...roles });
      }
    }
    return myProjects;
  };

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
          <i className="fa fa-ban text-danger"></i>
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
    const { projectRoleCols } = this.state;
    const { people } = this.props;
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return (
      <div className="col-9">
        <div className="d-flex flex-row justify-content-start align-items-center">
          <h1>My Roles</h1>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary h-50 ml-3"
            onClick={() => this.props.onRoleRefresh()}
          >
            <i className="fa fa-refresh mr-2"></i>
            Refresh Roles
          </button>
        </div>
        <h4 className="mt-4">
          Global Roles
        </h4>
        <table className="table table-striped table-bordered my-4 w-50">
          <tbody>
            <tr>
              <td>
                Project Lead
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("pl-tooltip", projectLeadDescription)}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people? people.roles.indexOf("project-leads") > -1 : false
                )}
              </td>
            </tr>
            <tr>
              <td>
                Facility Operator
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("fo-tooltip", facilityOperatorDescription)}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people ? people.roles.indexOf("facility-operators") > -1 : false
                )}
              </td>
            </tr>
            <tr>
              <td>
                Active User
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("fo-tooltip", "A fully enrolled FABRIC Testbed User with all the rights and privileges therein.")}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people ? people.roles.indexOf("fabric-active-users") > -1 : -1
                )}
              </td>
            </tr>
            <tr>
              <td>
                Jupyterhub
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("fo-tooltip", "Provides access to the Jupyterhub cluster. User must be a member of at least one project to maintain this access.")}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people ? people.roles.indexOf("Jupyterhub") > -1 : false
                )}
              </td>
            </tr>
          </tbody>
        </table>
        { 
          people && 
          people.roles.indexOf("project-leads") === -1 &&
          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              data-toggle="modal"
              data-target={`#${projectLeadRequest.id}`}
            >
              <i className="fa fa-sign-in mr-2"></i>
              Request to be Project Lead
            </button>
            <Modal
              id={projectLeadRequest.id}
              title={projectLeadRequest.title}
              link={projectLeadRequest.link}
              content={projectLeadRequest.content}
            />
          </div>
         }
        <h4 className="mt-4">Project Roles</h4>
        <table className="table table-striped table-bordered my-4 text-center">
          <tbody>
            <tr>
              <th>Project Name</th>
              {projectRoleCols.map((col, index) => {
                return (
                  <th key={`project-role-header-${index}`}>{col.display}</th>
                );
              })}
            </tr>
            {this.getMyProjects().map((project, index) => {
              return (
                <tr key={`project-role-row-${index}`}>
                  <td>
                    <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
                  </td>
                  {projectRoleCols.map((col, index) => {
                    return (
                      <td key={`project-role-col-${index}`}>
                        {this.renderRoleTableFields(project[col.field])}
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