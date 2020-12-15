import React from "react";
import { NavLink } from "react-router-dom";

import { hasCookie } from "../services/dummyAuth";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from "../imgs/fabric-brand.png";

class HeaderNav extends React.Component {
  state = {
    navItems: [
      { name: "Home", path: "/", child: [], exact: true },
      { name: "Resources", path: "/resources", child: [], exact: false },
      {
        name: "Projects",
        path: "/projects",
        child: [],
        exact: false,
      },
      {
        name: "Experiments",
        path: "/experiments",
        child: [],
        exact: false,
      },
      { name: "Guide", path: "/guide", child: [], exact: false },
      { name: "Links", path: "/links", child: [], exact: false },
      { name: "User Profile", path: "/user", child: [], exact: false },
    ],
  };

  handleLogin = () => {
    if (localStorage.getItem("cookieConsent")) {
      window.location.href = "/login";
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  }

  handleLogout = () => {
    localStorage.removeItem("userID");
    window.location.href = "/logout";
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-light">
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
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNavDropdown"
          aria-controls="navbarNavDropdown"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {!hasCookie("fabric-service") && (
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
              <li className="nav-item ml-4">
                <button
                  onClick={this.handleLogin}
                  className="btn btn-md btn-warning text-white"
                >
                  Login
                </button>
              </li>
            </ul>
          </div>
        )}
        {hasCookie("fabric-service") && (
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav">
              {this.state.navItems.map((item, index) => {
                return (
                  <li
                    className={
                      "nav-item" + (item.child.length > 0 ? " dropdown" : "")
                    }
                    key={index}
                  >
                    <NavLink
                      className={
                        "nav-link" +
                        (item.child.length > 0 ? " dropdown-toggle" : "")
                      }
                      to={item.path}
                      id={`navbarDropdownMenuLink-${index}`}
                      data-toggle={item.child.length > 0 ? "dropdown" : ""}
                      aria-haspopup="true"
                      aria-expanded="false"
                      exact={item.exact}
                    >
                      {item.name}
                    </NavLink>
                    {item.child.length > 0 && (
                      <div
                        className="dropdown-menu"
                        aria-labelledby={`navbarDropdownMenuLink-${index}`}
                      >
                        {item.child.map((sub_item, sub_index) => {
                          return (
                            <NavLink
                              className="dropdown-item"
                              to={sub_item.path}
                              key={sub_index}
                            >
                              {sub_item.name}
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
              <React.Fragment>
                <li className="nav-item ml-4">
                  <button
                    onClick={this.handleLogout}
                    className="btn btn-md btn-warning text-white"
                  >
                    Logout
                  </button>
                </li>
              </React.Fragment>
            </ul>
          </div>
        )}
      </nav>
    );
  }
}

export default HeaderNav;
