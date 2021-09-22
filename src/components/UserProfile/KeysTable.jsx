import React, { Component } from "react";
import Table from "../common/Table";

class KeysTable extends Component {
  columns = [
      { path: "name", label: "Name" },
      { path: "type", label: "Type" },
      { path: "id", label: "ID" },
      { path: "create_date", label: "Create Date" },
      { path: "expire_date", label: "Expire Date" },
      {
        content: () => (
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fa fa-ellipsis-h"></i>
            </button>
            <div className="dropdown-menu">
              <span className="dropdown-item">Download</span>
              <span className="dropdown-item">Fingerprint</span>
            </div>
          </div>
        ),
      },
    ];

  render() {
    const { keys, onSort, sortColumn } = this.props;
    return (
      <Table
        columns={this.columns}
        data={keys}
        sortColumn={sortColumn}
        onSort={onSort}
      />
    );
  }
}

export default KeysTable;