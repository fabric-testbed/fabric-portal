import React from "react";
import { NavLink } from "react-router-dom";
import withRouter from "./common/withRouter.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { default as portalData } from "../services/portalData.json";
import { getCookieConsentValue } from "react-cookie-consent";
import checkPortalType from "../utils/checkPortalType";
import productionLogo from "../imgs/fabric-brand.png";
import alphaLogo from "../imgs/fabric-brand-alpha.png";
import betaLogo from "../imgs/fabric-brand-beta.png";
import clearLocalStorage from "../utils/clearLocalStorage";

const Header = (props) => {
  const nonAuthNavItems = [
    { name: "Home", path: "/", child: [] },
    { name: "Resources", path: "/resources/all", child: [] },
    {
      name: "Knowledge Base",
      href: portalData.knowledgeBaseLink,
      child: [],
      path: ""
    },
    { name: "Contact Us", path: "/help", child: [] },
  ]
  
  const authNavItems = [
    { name: "Home", path: "/", child: [] },
    { name: "Resources", path: "/resources/all", child: [] },
    {
      name: "Experiments",
      path: "/experiments",
      child: []
    },
    {
      name: "Knowledge Base",
      href: portalData.knowledgeBaseLink,
      child: [],
      path: ""
    },
    {
      name: "JupyterHub",
      href: portalData.jupyterHubLinks[checkPortalType(window.location.href)],
      child: [],
      path: ""
    },
    { name: "User Profile", path: "/user", child: [] },
    { name: "Contact Us", path: "/help", child: [] },
  ]

  const navItems = props.userStatus !== "active" ? nonAuthNavItems : authNavItems;
  
  const handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      // remove old user status stored in browser.
      localStorage.removeItem("userStatus");
      // nginx handle login url.
      window.location.href = "/login";
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  }
  
  const handleLogout = () => {
    // revoke token generated by crendential manager.
    // TODO: Enable the revoke token when logout after removing credential manager from portal.
    // this.revokeToken();
    clearLocalStorage();
    // nginx handle logout url.
    window.location.href = "/logout";
  }
  
  const getLogoSrc = () => {
    const portal = checkPortalType(window.location.href);
    if (portal === "production") {
      return productionLogo;
    }
    if (portal === "beta") {
      return betaLogo;
    }
    if (portal === "alpha") {
      return alphaLogo;
    }
  }

  const handleSearch = () => {
    props.navigate(`/search-results`);
  };

  const raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
      props.navigate(`/search-results`);
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <NavLink className="navbar-brand" to="/">
      <img
        src={getLogoSrc()}
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
              {
                item.href && <a
                  className="nav-link"
                  key={item.name}
                  href={item.href}
                  target="_blank"
                  rel="noreferrer"
                >
                  {item.name}
                </a>
              }
              {
                !item.href && 
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
                >
                  {item.name}
                </NavLink>
              }
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
                        rel="noreferrer"
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
      {
        props.userStatus === "active" && !window.location.href.includes("/search-results") &&
        <form className="form-inline my-2 mr-2 my-lg-0">
          <input
            className="form-control"
            type="search"
            placeholder="Search People/Projects"
            aria-label="Search"
            onChange={props.onQueryChange}
            onKeyDown={raiseInputKeyDown}
          />
           <div className="input-group-append">
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={handleSearch}
              >
                  <i className="fa fa-search"></i>
              </button>
            </div>
         </form>
      }
      { props.userStatus !== "active" ? 
        <form className="form-inline my-2 my-lg-0">
          <NavLink to="/login">
            <button
              onClick={handleLogin}
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
              onClick={handleLogout}
              className="btn btn-outline-success my-2 my-sm-0"
            >
              Log out
            </button>
          </NavLink>
        </form>
      }
    </div>
  </nav>
  )
}

export default withRouter(Header);