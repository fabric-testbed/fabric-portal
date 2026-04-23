import React from "react";
import checkGlobalRoles from "@/lib/permissions/checkGlobalRoles";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { default as portalData } from "../../services/portalData.json";
import _ from "lodash";
import { HelpCircle, Check, Ban } from "lucide-react";

function renderRoleTableFields(param) {
  switch (typeof param) {
    case "boolean":
      return param === true ? (
        <Check className="me-2 text-success" size={16} />
      ) : (
        <Ban className="text-danger" size={16} />
      );
    case "string":
      return _.truncate(param, { 'length': 100, 'separator': ' ' });
    default:
      return param;
  }
}

function GlobalRoles({ user }) {
  const globalRoles = checkGlobalRoles(user);
  const renderTooltip = (id, content) => (
    <Tooltip id={id}>{content}</Tooltip>
  );

  return (
    <div>
      <h4 className="mt-4">Global Roles</h4>
      <table className="table table-striped table-bordered my-4 w-50">
        <tbody>
          <tr>
            <td>
              Project Administrator
            </td>
            <td className="text-center">{renderRoleTableFields(globalRoles.isProjectAdmin)}</td>
          </tr>
          <tr>
            <td>
              Facility Operator
              <OverlayTrigger placement="right" delay={{ show: 100, hide: 300 }} overlay={renderTooltip("fo-tooltip", portalData.helperText.facilityOperatorDescription)}>
                <HelpCircle className="mx-2 text-secondary" size={16} />
              </OverlayTrigger>
            </td>
            <td className="text-center">{renderRoleTableFields(globalRoles.isFacilityOperator)}</td>
          </tr>
          <tr>
            <td>
              Active User
              <OverlayTrigger placement="right" delay={{ show: 100, hide: 300 }} overlay={renderTooltip("au-tooltip", portalData.helperText.activeUserDescription)}>
                <HelpCircle className="mx-2 text-secondary" size={16} />
              </OverlayTrigger>
            </td>
            <td className="text-center">{renderRoleTableFields(globalRoles.isActiveUser)}</td>
          </tr>
          <tr>
            <td>
              Jupyterhub
              <OverlayTrigger placement="right" delay={{ show: 100, hide: 300 }} overlay={renderTooltip("jh-tooltip", portalData.helperText.jupyterhubDescription)}>
                <HelpCircle className="mx-2 text-secondary" size={16} />
              </OverlayTrigger>
            </td>
            <td className="text-center">{renderRoleTableFields(globalRoles.isJupterhubUser)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default GlobalRoles;
