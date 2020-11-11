import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../components/common/Table";

class ProjectsTable extends Component {
  columns = [
    {
      path: "name",
      label: "Project Name",
      content: (project) => (
        <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
      ),
    },
    { path: "description", label: "Description" },
    { path: "facility", label: "Facility" },
    // { path: "created_by", label: "Created By" },
    { path: "uuid", label: "UUID" },
  ];

  render() {
    const { projects, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={projects}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default ProjectsTable;
