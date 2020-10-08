import React from "react";
import SideNav from "../components/SideNav";
import AccountInfo from "../components/UserProfile/AccountInfo";

const User = () => {
  return (
    <div className="container">
      <div className="row">
        <SideNav />
        <AccountInfo />
      </div>
    </div>
  );
};

export default User;
