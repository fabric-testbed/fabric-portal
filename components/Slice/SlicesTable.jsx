import React, { Component } from "react";
import Link from "next/link";
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
          <Link href={`/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
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
          <Link href={`/projects/${slice.project_id}`}>{slice.project_name}</Link>
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
          <Link href={`/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
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
      }
    ],
    "allProjectSlices": [
      {
        path: "name",
        label: "Slice Name",
        content: (slice) => ( <span>{slice.name}</span> ),
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
        path: "owner_email",
        label: "Owner",
        content: (slice) => (
          <Link href={`/users/${slice.owner_user_id}`}>{slice.owner_email}</Link>
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
      }
    ]
  };

  render() {
    const { slices, onSort, sortColumn, parent } = this.props;
    let columnOptions = "allSlices";
    if (parent === "Projects") {
      columnOptions = "projectSlices";
    } else if (parent === "allProjectSlices") {
      columnOptions = "allProjectSlices";
    }
    
    return (
      <Table
        columns={this.columns[columnOptions]}
        data={slices}
        sortColumn={sortColumn}
        onSort={onSort}
        tStyle={"table-md"}
      />
    );
  }
}

export default SlicesTable;
