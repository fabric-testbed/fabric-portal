import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import CopyButton from "../common/CopyButton";
import sliceTimeParser from "../../utils/sliceTimeParser.js";

class SlicesTable extends Component {
  columns = [
      {
        path: "name",
        label: "Slice Name",
        content: (slice) => (
          <Link to={`/slices/${slice.slice_id}`}>{slice.name}</Link>
        ),
      },
      { path: "state", label: "Slice State" },
      {
        path: "lease_end_time",
        label: "Lease End",
        content: (slice) => (
          <span>{sliceTimeParser(slice.lease_end_time)}</span>
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
        size={"md"}
      />
    );
  }
}

export default SlicesTable;
