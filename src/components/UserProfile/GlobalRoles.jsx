import React from "react";
import checkGlobalRoles from "../../utils/checkGlobalRoles"; 
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as portalData } from "../../services/portalData.json";
import _ from "lodash";

class GlobalRoles extends React.Component {
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
    const { user } = this.props;
    const globalRoles = checkGlobalRoles(user);
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
                  overlay={renderTooltip("pl-tooltip", portalData.helperText.projectLeadDescription)}
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
                  overlay={renderTooltip("fo-tooltip", portalData.helperText.facilityOperatorDescription)}
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
                  overlay={renderTooltip("fo-tooltip", portalData.helperText.activeUserDescription)}
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
                  overlay={renderTooltip("fo-tooltip", portalData.helperText.jupyterhubDescription)}
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
          <button
            type="button"
            className="btn btn-sm btn-outline-primary"
            onClick={() => window.open(
              `${portalData.jiraLinks.projectLeadRequest}?email=${user.email}`,
              "_blank")
            }
          >
            <i className="fa fa-sign-in mr-2"></i>
            Request to be Project Lead
          </button>
         }
      </div>
    )
  }
}

export default GlobalRoles;