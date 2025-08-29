import React from "react";
import GlobalRoles from "./GlobalRoles";
import ProjectRoles from "./ProjectRoles";
import { default as portalData } from "../../services/portalData.json";

class MyRoles extends React.Component {
  render() {
    return (
      <div className="col-9">
        <div className="d-flex flex-row justify-content-start align-items-center">
          <h1>My Roles</h1>
          <button
            type="button"
            className="btn btn-sm btn-outline-primary h-50 ms-3"
            onClick={() => this.props.onRoleRefresh()}
          >
            <i className="fa fa-refresh me-2"></i>
            Refresh Roles
          </button>
        </div>
        <div className="alert alert-primary my-2" role="alert">
          Please consult &nbsp;
          <a
            href={portalData.learnArticles.guideToProjectPermissions}
            target="_blank"
            rel="noreferrer"
          >
            this guide
          </a>&nbsp;
          for FABRIC user roles information.
        </div>
        <GlobalRoles user={this.props.user} />
        <ProjectRoles />
      </div>
    );
  }
}

export default MyRoles;