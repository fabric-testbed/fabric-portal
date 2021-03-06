import React from "react";
import { NavLink } from "react-router-dom";

import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { knowledgeBaseLink, jupyterHubLink } from "../services/portalData.json";

import logo from "../imgs/fabric-brand.png";

class Header extends React.Component {
  state = {
    nonAuthNavItems: [
      { name: "Home", path: "/", child: [], exact: true },
      { name: "Resources", path: "/resources", child: [], exact: false },
    ],
    authNavItems: [
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
      { 
        name: "Links",
        path: "/links",
        child: [
          { name: "Knowledge Base", href: knowledgeBaseLink, path: ""},
          { name: "JupyterHub", href: jupyterHubLink, path: ""}
          ],
          exact: false
        },
      { name: "User Profile", path: "/user", child: [], exact: false },
    ],
  };
  
  handleLogin = () => {
    if (localStorage.getItem("cookieConsent")) {
      // remove old user status stored in browser.
      localStorage.removeItem("userStatus");
      // nginx handle login url.
      window.location.href = "/login";
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  }

  handleLogout = () => {
    // remove stored user ID got from UIS whoami.
    localStorage.removeItem("userID");
    // remove old user status stored in browser.
    localStorage.removeItem("userStatus");
    // nginx handle logout url.
    window.location.href = "/logout";
  }

  render() {
    const navItems = this.props.userStatus !== "active" ? 
      this.state.nonAuthNavItems : this.state.authNavItems;
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
          <div className="collapse navbar-collapse" id="navbarNavDropdown">
            <ul className="navbar-nav mr-auto">
            {
              navItems.map((item, index) => {
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
            { this.props.userStatus !== "active" ? 
              <form className="form-inline my-2 my-lg-0">
                <NavLink to="/login">
                  <button
                    onClick={this.handleLogin}
                    className="btn btn-outline-success my-2 my-sm-0 mr-2"
                  >
                    Log in
                  </button>
                </NavLink>
                <NavLink to="/signup/1">
                  <button
                    className="btn btn-outline-primary my-2 my-sm-0"
                  >
                    Sign up
                  </button>
                </NavLink>
              </form> :
              <form className="form-inline my-2 my-lg-0">
                <NavLink to="/logout">
                  <button
                    onClick={this.handleLogout}
                    className="btn btn-outline-success my-2 my-sm-0"
                  >
                    Log out
                  </button>
                </NavLink>
              </form>
            }
          </div>
      </nav>
    );
  }
}

export default Header;
