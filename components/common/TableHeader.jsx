import React from "react";
import { ArrowUp, ArrowDown } from "lucide-react";

function TableHeader({ columns, sortColumn, onSort, tHeadStyle }) {
  const raiseSort = (path) => {
    if (path !== "") {
      const newSortColumn = { ...sortColumn };
      if (newSortColumn.path === path) {
        newSortColumn.order = newSortColumn.order === "asc" ? "desc" : "asc";
      } else {
        newSortColumn.path = path;
        newSortColumn.order = "asc";
      }
      onSort(newSortColumn);
    }
  };

  const renderSortIcon = (column) => {
    if (column.path !== sortColumn.path) return null;
    if (sortColumn.order === "asc") return <ArrowUp size={14} />;
    if (sortColumn.order === "desc") return <ArrowDown size={14} />;
  };

  return (
    <thead className={tHeadStyle}>
      <tr>
        {sortColumn && columns.map((column) => (
          <th
            key={column.path || column.key || "table-header"}
            onClick={() => raiseSort(column.path)}
            scope="col"
            style={column.style}
          >
            {column.label} {renderSortIcon(column)}
          </th>
        ))}
        {!sortColumn && columns.map((column) => (
          <th key={column.path || column.key || "table-header"} style={column.style}>
            {column.label}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export default TableHeader;
