import React from "react";
import Link from "next/link";
import Table from "../common/Table";
import CopyButton from "../common/CopyButton";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";

const columns = {
  "allSlices": [
    {
      label: "Slice Name",
      content: (slice) => (
        <Link href={`/experiments/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
      ),
    },
    { label: "Slice State", content: (slice) => <span>{slice.state}</span> },
    {
      label: "Lease End",
      content: (slice) => (
        <span>{utcToLocalTimeParser(slice.lease_end_time)}</span>
      )
    },
    {
      label: "Project",
      content: (slice) => (
        <Link href={`/projects/${slice.project_id}`}>{slice.project_name}</Link>
      ),
    },
    {
      label: "ID",
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
      label: "Slice Name",
      content: (slice) => (
        <Link href={`/experiments/slices/${slice.slice_id}/${slice.project_id}`}>{slice.name}</Link>
      ),
    },
    { label: "Slice State", content: (slice) => <span>{slice.state}</span> },
    {
      label: "Lease End",
      content: (slice) => (
        <span>{utcToLocalTimeParser(slice.lease_end_time)}</span>
      )
    },
    {
      label: "ID",
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
      label: "Slice Name",
      content: (slice) => <span>{slice.name}</span>,
    },
    { label: "Slice State", content: (slice) => <span>{slice.state}</span> },
    {
      label: "Lease End",
      content: (slice) => (
        <span>{utcToLocalTimeParser(slice.lease_end_time)}</span>
      )
    },
    {
      label: "Owner",
      content: (slice) => (
        <Link href={`/user/public-profile/${slice.owner_user_id}`}>{slice.owner_email}</Link>
      )
    },
    {
      label: "ID",
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

function SlicesTable({ slices, parent }) {
  let columnOptions = "allSlices";
  if (parent === "Projects") {
    columnOptions = "projectSlices";
  } else if (parent === "allProjectSlices") {
    columnOptions = "allProjectSlices";
  }

  return (
    <Table
      columns={columns[columnOptions]}
      data={slices}
      tStyle={"table-md"}
    />
  );
}

export default SlicesTable;
