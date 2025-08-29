import React, { Component } from "react";
import Link from "next/link";
import Table from "../common/Table";

class UsersTable extends Component {
  columns = [
    {
      path: "name",
      label: "Name",
      content: (user) => (
        <Link to={`/users/${user.uuid}`}>{user.name}</Link>
      )
    },
    { path: "email", label: "Email" },
    { path: "uuid", label: "ID" },
  ]

  render() {
    const { users } = this.props;
  
    return (
      <Table
        columns={this.columns}
        data={users}
        tStyle={"table-md"}
      />
    );
  }
}

export default UsersTable;
