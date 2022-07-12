import React from "react";
import { Link } from "react-router-dom";
import Modal from "../common/Modal";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { getMyProjects } from "../../services/projectServices.js";
import { default as portalData } from "../../services/portalData.json";
import _ from "lodash";
import { toast } from "react-toastify";

class MyRoles extends React.Component {
  state = {
    myProjects: [],
  };

  async componentDidMount(){
    try {
      const { data: res } = await getMyProjects();
      const myProjects = res.results;
      this.setState({ myProjects });
    } catch (ex) { 
      toast.error("Failed to load user's projects'. Please re-login.");
      console.log("Failed to load user's projects: " + ex.response.data);
    }
  }

  checkProjectRole = (projectID, role) => {
    let role_str = projectID + "-" + role;
    if (this.props.people.roles !== undefined) {
      return this.props.people.roles.indexOf(role_str) > -1;
    }
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
        <div className="alert alert-primary my-2" role="alert">
          Please consult &nbsp;
          <a
            href="https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions/"
            target="_blank"
            rel="noreferrer"
          >
            this guide
          </a>&nbsp;
          for FABRIC user roles information.
        </div>
        {/* <h4 className="mt-4">
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
                  overlay={renderTooltip("pl-tooltip", portalData.projectLeadDescription)}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people.roles !== undefined ? people.roles.indexOf("project-leads") > -1 : false
                )}
              </td>
            </tr>
            <tr>
              <td>
                Facility Operator
                <OverlayTrigger
                  placement="right"
                  delay={{ show: 100, hide: 300 }}
                  overlay={renderTooltip("fo-tooltip", portalData.facilityOperatorDescription)}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(
                  people.roles !== undefined ? people.roles.indexOf("facility-operators") > -1 : false
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
                  people.roles !== undefined ? people.roles.indexOf("fabric-active-users") > -1 : -1
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
                  people.roles !== undefined ? people.roles.indexOf("Jupyterhub") > -1 : false
                )}
              </td>
            </tr>
          </tbody>
        </table> */}
        {/* { 
          people.roles && 
          people.roles.indexOf("project-leads") === -1 &&
          <div>
            <button
              type="button"
              className="btn btn-sm btn-outline-primary"
              data-toggle="modal"
              data-target={`#${portalData.projectLeadRequest.id}`}
            >
              <i className="fa fa-sign-in mr-2"></i>
              Request to be Project Lead
            </button>
            <Modal
              id={portalData.projectLeadRequest.id}
              title={portalData.projectLeadRequest.title}
              link={portalData.projectLeadRequest.link}
              content={portalData.projectLeadRequest.content}
            />
          </div>
         } */}
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
    );
  }
}

export default MyRoles;