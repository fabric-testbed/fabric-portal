import React, { Component } from "react";
import _ from "lodash";

class TableBody extends Component {
  renderCell = (item, column) => {
    if (column.content) return column.content(item);

    if (Array.isArray(column.path)) {
      return `${_.get(item, column.path[0])} / ${_.get(item, column.path[1])}`;
    }

    return _.get(item, column.path);
  };

  createKey = (index, column) => {
    if (Array.isArray(column.path)) {
      return index + (column.path[0] || column.key);
    }

    return index + (column.path || column.key);
  };

  render() {
    const { data, columns } = this.props;
    return (
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            {columns.map((column) => (
              <td key={this.createKey(index, column)} className="align-middle">
                {this.renderCell(item, column)}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    );
  }
}

export default TableBody;
