import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";

class SlicesTable extends Component {
  columns = [
      {
        path: "slice_name",
        label: "Slice Name",
        content: (slice) => (
          <Link to={`/slices/${slice.slice_id}`}>{slice.slice_name}</Link>
        ),
      },
      { path: "slice_state", label: "Slice State" },
      {
        path: "lease_end",
        label: "Lease End",
        content: (slice) => (
          <span>{toLocaleTime(slice.lease_end)}</span>
        )
      },
      {
        content: (slice) => (
          <CopyButton
            id={slice.slice_id}
            text={"Slice ID"}
          />
        ),
      },
    ];

  render() {
    const { slices, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={slices}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default SlicesTable;
