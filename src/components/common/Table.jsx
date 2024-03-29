import React from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

const Table = ({ columns, onSort, sortColumn, data, size, onCheck }) => {
  return (
    <table className={`table table-${size} table-hover`}>
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
      />
      <TableBody
        columns={columns}
        data={data}
        onCheck={onCheck}
      />
    </table>
  );
};

export default Table;
