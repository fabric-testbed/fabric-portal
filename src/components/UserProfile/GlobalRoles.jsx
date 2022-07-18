import React from "react";
import checkGlobalRoles from "../../utils/checkGlobalRoles"; 
import Modal from "../common/Modal";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as portalData } from "../../services/portalData.json";

class GlobalRoles extends React.Component {
  render() {
    const globalRoles = checkGlobalRoles(this.props.user);
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return (
      <div>
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
                  overlay={renderTooltip("pl-tooltip", portalData.projectLeadDescription)}
                >
                  <i className="fa fa-question-circle text-secondary ml-2"></i>
                </OverlayTrigger>
              </td>
              <td className="text-center">
                {this.renderRoleTableFields(globalRoles.isProjectLead)}
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
                {this.renderRoleTableFields(globalRoles.isFacilityOperator)}
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
                {this.renderRoleTableFields(globalRoles.isActiveUser)}
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
                {this.renderRoleTableFields(globalRoles.isJupterhubUser)}
              </td>
            </tr>
          </tbody>
        </table>
        { 
          !globalRoles.isProjectLead &&
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
         }
      </div>
    )
  }
}

export default GlobalRoles;