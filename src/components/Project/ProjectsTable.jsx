import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import _ from "lodash";

class ProjectsTable extends Component {
  columns = [
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
        label: "Created At",
      },
      {
        content: (project) => (
          <Link to={`/projects/${project.uuid}`}>
            <button className="btn btn-sm btn-primary">
              View
            </button>
          </Link>
        ),
      }
    ]

  render() {
    const { projects } = this.props;
  
    return (
      <Table
        columns={this.columns}
        data={projects}
        size={"md"}
      />
    );
  }
}

export default ProjectsTable;
