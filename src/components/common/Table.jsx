import React from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

const Table = ({ columns, onSort, sortColumn, data, size, isSelectable, onCheck }) => {
  return (
    <table className={`table table-${size} table-hover`}>
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
        isSelectable={isSelectable ? true : false}
      />
      <TableBody
        columns={columns}
        data={data}
        isSelectable={isSelectable ? true : false}
      />
    </table>
  );
};

export default Table;
