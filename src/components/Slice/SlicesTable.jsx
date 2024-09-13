import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import CopyButton from "../common/CopyButton";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";

class SlicesTable extends Component {
  columns = {
    "allSlices": [
      {
        path: "name",
        label: "Slice Name",
        content: (slice) => (
          <Link to={`/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
        ),
      },
      { path: "state", label: "Slice State" },
      {
        path: "lease_end_time",
        label: "Lease End",
        content: (slice) => (
          <span>{utcToLocalTimeParser(slice.lease_end_time)}</span>
        )
      },
      {
        path: "project_name",
        label: "Project",
        content: (slice) => (
          <Link to={`/projects/${slice.project_id}`}>{slice.project_name}</Link>
        ),
      },
      {
        content: (slice) => (
          <CopyButton
            id={slice.slice_id}
            text={"Slice ID"}
            btnStyle={"btn btn-sm btn-primary"}
            showCopiedValue={true}
          />
        ),
      },
    ],
    "projectSlices": [
      {
        path: "name",
        label: "Slice Name",
        content: (slice) => (
          <Link to={`/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
        ),
      },
      { path: "state", label: "Slice State" },
      {
        path: "lease_end_time",
        label: "Lease End",
        content: (slice) => (
          <span>{utcToLocalTimeParser(slice.lease_end_time)}</span>
        )
      },
      {
        content: (slice) => (
          <CopyButton
            id={slice.slice_id}
            text={"Slice ID"}
            btnStyle={"btn btn-sm btn-primary"}
            showCopiedValue={true}
          />
        ),
      },
    ]
  };

  render() {
    const { slices, onSort, sortColumn, parent } = this.props;
    return (
      <Table
        columns={parent === "Projects" ? this.columns["projectSlices"] : this.columns["allSlices"]}
        data={slices}
        sortColumn={sortColumn}
        onSort={onSort}
        style={"table-md"}
      />
    );
  }
}

export default SlicesTable;
