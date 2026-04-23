import React from "react";
import Link from "next/link";
import Table from "../common/Table";

const columns = [
  {
    path: "name",
    label: "Name",
    content: (user) => (
      <Link href={`/user/public-profile/${user.uuid}`}>{user.name}</Link>
    )
  },
  { path: "email", label: "Email" },
  { path: "uuid", label: "ID" },
];

function UsersTable({ users }) {
  return (
    <Table
      columns={columns}
      data={users}
      tStyle={"table-md"}
    />
  );
}

export default UsersTable;
