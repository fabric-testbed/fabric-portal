import React from "react";
import { NavLink } from "react-router-dom";

import logo from "../imgs/fabric-brand.png";

class HeaderNav extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        { name: "Home", path: "/" },
        { name: "Resources", path: "/resources" },
        { name: "Projects", path: "/projects" },
        { name: "Experiments", path: "/experiments" },
        { name: "Guide", path: "/guide" },
        { name: "Links", path: "/links" },
        { name: "User Profile", path: "/user" },
      ],
    };
  }

  render() {
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
          {this.state.data.map((value, index) => {
            return (
              <li className="nav-item" key={index}>
                <NavLink className="nav-link" to={value.path}>
                  {value.name}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </nav>
    );
  }
}

export default HeaderNav;
