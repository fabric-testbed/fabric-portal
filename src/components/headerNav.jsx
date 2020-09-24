import React from "react";
import { NavLink } from "react-router-dom";

import logo from "../imgs/fabric-brand.png";

const HeaderNav = () => {
  return (
    <nav className="navbar navbar-light bg-light">
      <ul className="nav">
        <NavLink className="navbar-brand" to="/">
          <img
            src={logo}
            width="70"
            height="30"
            className="d-inline-block align-top"
            alt=""
          />
          FABRIC Portal
        </NavLink>
        <li className="nav-item">
          <NavLink className="nav-link" to="/">
            Home
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/projects">
            Projects
          </NavLink>
        </li>
        <li className="nav-item">
          <NavLink className="nav-link" to="/user">
            User Profile
          </NavLink>
        </li>
      </ul>
    </nav>
  );
};

export default HeaderNav;
