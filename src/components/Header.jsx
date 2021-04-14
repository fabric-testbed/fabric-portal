import React from "react";
import { NavLink } from "react-router-dom";

import { hasCookie } from "../services/dummyAuth";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import logo from "../imgs/fabric-brand.png";

class Header extends React.Component {
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
      { name: "Links", path: "/links", child: [
      { name: "JupyterHub", href: "https://jupyter-beta.fabric-testbed.net/", path: "" },
      ], exact: false },
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
    // remove stored user ID got from UIS whoami.
    localStorage.removeItem("userID");
    // remove cookie consent choice in local storage.
    // localStorage.removeItem("cookieConsent");
    // remove cookie consent and fabric-service auth cookie in cookies.
    // document.cookie = "cookieConsent=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    document.cookie = "fabric-service=; domain=fabric-testbed.net; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
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
        {/* {!hasCookie("fabric-service") && ( */}
        {true && (
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav mr-auto">
              <li className="nav-item">
                <NavLink className="nav-link" to="/">
                  Home
                </NavLink>
              </li>
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <NavLink to="/login">
                <button
                  onClick={this.handleLogin}
                  className="btn btn-outline-success my-2 my-sm-0 mr-2"
                >
                  Login
                </button>
              </NavLink>
              <NavLink to="/signup/1">
                <button
                  className="btn btn-outline-primary my-2 my-sm-0"
                >
                  Signup
                </button>
              </NavLink>
            </form>
          </div>
        )}
        {/* {hasCookie("fabric-service") && ( */}
        {false && (
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul  className="navbar-nav mr-auto">
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
                            <a
                              className="dropdown-item"
                              key={sub_index}
                              href={sub_item.href}
                              target="_blank"
                            >
                              {sub_item.name}
                            </a>
                          );
                        })}
                      </div>
                    )}
                  </li>
                );
              })}
            </ul>
            <form class="form-inline my-2 my-lg-0">
              <NavLink to="/logout">
                <button
                  onClick={this.handleLogout}
                  className="btn btn-outline-success my-2 my-sm-0"
                >
                  Logout
                </button>
              </NavLink>
            </form>
          </div>
        )}
      </nav>
    );
  }
}

export default Header;
