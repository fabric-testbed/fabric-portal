import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import _ from "lodash";

class ProjectsTable extends Component {
  columns = 
  {
    "myProjects":[
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
    "allProjects":[
      {
        path: "name",
        label: "Project Name",
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
    ],
    "allProjectsForFacilityOperator":[
      {
        path: "name",
        label: "Project Name",
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
  };

  render() {
    const { projects, onSort, sortColumn, type, isFacilityOperator } = this.props;
    const cols = (isFacilityOperator && type === "allProjects") ? this.columns["allProjectsForFacilityOperator"] : this.columns[type];
    return (
      <Table
        columns={cols}
        data={projects}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProjectsTable;
