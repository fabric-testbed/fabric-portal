import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import _ from "lodash";

class ProjectsTable extends Component {
  // handleClick = (project) => {
  //   alert(`Request to join project: ${project.uuid}`)
  // }

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
    "otherProjects":[
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
      // {
      //   content: (project) => (
      //     <button
      //       // onClick={() => this.handleClick(project)}
      //       className="btn btn-sm btn-primary"
      //       disabled={true}
      //     >
      //       Request to Join
      //     </button>
      //   ),
      // },
    ],
  };

  render() {
    const { projects, onSort, sortColumn, type } = this.props;
    return (
      <Table
        columns={this.columns[type]}
        data={projects}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProjectsTable;
