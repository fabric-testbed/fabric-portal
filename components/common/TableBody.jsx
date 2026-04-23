import React from "react";
import _ from "lodash";

function TableBody({ data, columns }) {
  const renderCell = (item, column) => {
    if (column.content) return column.content(item);
    if (Array.isArray(column.path)) {
      return `${_.get(item, column.path[0])} / ${_.get(item, column.path[1])}`;
    }
    return _.get(item, column.path);
  };

  const createKey = (index, column) => {
    if (Array.isArray(column.path)) {
      return index + (column.path[0] || column.key);
    }
    return index + (column.path || column.key);
  };

  return (
    <tbody>
      {data.map((item, index) => (
        <tr key={index}>
          {columns.map((column) => (
            <td key={createKey(index, column)} className="align-middle">
              {renderCell(item, column)}
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  );
}

export default TableBody;
