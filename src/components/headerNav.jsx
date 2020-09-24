import React from "react";
import logo from "../imgs/fabric-brand.png";

const HeaderNav = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <a className="navbar-brand" href="#">
        <img
          src={logo}
          width="70"
          height="30"
          className="d-inline-block align-top"
          alt=""
        />
        FABRIC Portal
      </a>
    </nav>
  );
};

export default HeaderNav;
