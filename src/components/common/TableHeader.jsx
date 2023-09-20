import React, { Component } from "react";

// interface
// columns: array
// sortColumn: obj
// onSort: function

class TableHeader extends Component {
  // logic to determine the sort order.
  raiseSort = (path) => {
    const sortColumn = { ...this.props.sortColumn };
    // click twice on the same col to reverse sorting.
    // click the first time will ascend at default.
    if (sortColumn.path === path) {
      sortColumn.order = sortColumn.order === "asc" ? "desc" : "asc";
    } else {
      sortColumn.path = path;
      sortColumn.order = "asc";
    }

    this.props.onSort(sortColumn);
  };

  renderSortIcon = (column) => {
    const { sortColumn } = this.props;
    if (column.path !== this.props.sortColumn.path) return null;

    // render different icons depending on the sort order.
    if (sortColumn.order === "asc") return <i className="fa fa-sort-asc" />;
    if (sortColumn.order === "desc") return <i className="fa fa-sort-desc" />;
  };

  render() {
    const { sortColumn } = this.props;
    // const that = this;
    return (
      <thead>
        <tr>
          {sortColumn && this.props.columns.map((column) => (
            <th
              className="clickable"
              key={column.path || column.key || "table-header"}
              onClick={() => this.raiseSort(column.path)}
              scope="col"
            >
              {column.label} {this.renderSortIcon(column)}
            </th>
          ))}
          {!sortColumn && this.props.columns.map((column) => (
            <th
              className="clickable"
              key={column.path || column.key || "table-header"}
            >
              {column.label}
            </th>
          ))}
        </tr>
      </thead>
    );
  }
}

export default TableHeader;
