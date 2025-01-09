import React from "react";
import TableBody from "./TableBody";
import TableHeader from "./TableHeader";

const Table = ({ columns, onSort, sortColumn, data, tStyle, tHeadStyle, onCheck }) => {
  return (
    <table className={`table table-hover bg-white ${tStyle}`}>
      <TableHeader
        columns={columns}
        sortColumn={sortColumn}
        onSort={onSort}
        tHeadStyle={tHeadStyle}
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
