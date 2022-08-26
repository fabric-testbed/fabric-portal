import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import _ from "lodash";

class ProjectsTable extends Component {
  hasAccessToProject = (project) => {
    const membership = project.membership;
    if (membership) {
      return project.is_public || membership.is_creator 
      || membership.is_owner || membership.is_member;
    } else {
      return project.is_public;
    }
  }

  columns = { 
    "alwaysShowLinks": [
      {
        path: "name",
        label: "Project Name",
        content: (project) => (
          <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
        ),
      },
      { 
        path: "description",
        label: "Description",
        content: (project) => (
          <span>
            {_.truncate(project.description, {
              'length': 250,
              'separator': ' '
            })}
          </span>
        )
      },
      { path: "facility", label: "Facility" },
      {
        path: "created_time",
        label: "Created Time",
      },
      {
        content: (project) => (
          <Link to={`/projects/${project.uuid}`}>
            <button className="btn btn-sm btn-primary">
              View
            </button>
          </Link>
        ),
      },
    ],
    "onlyShowPublicLinks": [
      {
        path: "name",
        label: "Project Name",
        content: (project) => (
          this.hasAccessToProject(project) ? <Link to={`/projects/${project.uuid}`}>{project.name}</Link> : <span>{project.name}</span>
        )
      },
      { 
        path: "description",
        label: "Description",
        content: (project) => (
          <span>
            {_.truncate(project.description, {
              'length': 250,
              'separator': ' '
            })}
          </span>
        )
      },
      { path: "facility", label: "Facility" },
      {
        path: "created_time",
        label: "Created Time",
      },
      {
        content: (project) => (
          <Link to={`/projects/${project.uuid}`}>
            <button
              className="btn btn-sm btn-primary"
              disabled={!this.hasAccessToProject(project)}
            >
              View
            </button>
          </Link>
        ),
      }
    ]
  }

  render() {
    const { projects, type, isFacilityOperator } = this.props;
    const cols = (isFacilityOperator || type === "myProjects") ? this.columns["alwaysShowLinks"] : this.columns["onlyShowPublicLinks"] ;
    return (
      <Table
        columns={cols}
        data={projects}
        size={"md"}
      />
    );
  }
}

export default ProjectsTable;
