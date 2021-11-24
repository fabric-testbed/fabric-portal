import React, { Component } from "react";
import Table from "../common/Table";

class KeysTable extends Component {
  columns = [
      { path: "comment", label: "Name" },
      { path: "created_on", label: "Create Date" },
      { path: "expires_on", label: "Expiration Date" },
      { path: "description", label: "Description" },
      { path: "fingerprint", label: "Fingerprint" },
      { path: "name", label: "Type" },
      { path: "public_key", label: "Public Key"},
      {
        content: () => (
          <div className="btn-group">
            <button type="button" className="btn btn-sm btn-outline-primary" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <i className="fa fa-ellipsis-h"></i>
            </button>
            <div className="dropdown-menu">
              <span className="dropdown-item">Download</span>
              <span className="dropdown-item">Fingerprint</span>
              <div className="dropdown-divider"></div>
              <span className="dropdown-item">Delete</span>
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