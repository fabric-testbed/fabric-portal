import React from "react";
import withRouter from "./common/withRouter.jsx";
import { Link, NavLink, useLocation } from "react-router-dom";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { default as portalData } from "../services/portalData.json";
import { getCookieConsentValue } from "react-cookie-consent";
import checkPortalType from "../utils/checkPortalType";
import productionLogo from "../imgs/logos/fabric-brand.png";
import alphaLogo from "../imgs/logos/fabric-brand-alpha.png";
import betaLogo from "../imgs/logos/fabric-brand-beta.png";
import ProfileModal from './ProfileModal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = (props) => {
  const navItems = (props.globalRoles && !props.globalRoles.isJupterhubUser) ? [
    { 
      name: "Resources",
      path: "/resources",
      child: [
        {
          name: "Testbed Resources",
          path: "/resources/overview"
        },
        {
          name: "Measurement Metrics",
          path: "/resources/tools"
        }
      ]
    },
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
      child: [],
      path: "/jupyter-no-access"
    },
    { name: "Contact Us", path: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          path: "/about/about-fabric"
        },
        // {
        //   name: "SAC",
        //   path: "/about/sac"
        // },
        {
          name: "Leadership",
          path: "/about/leadership"
        }
      ],
      path: "/about"
    },
    {
      name: "Community",
      child: [
        {
          name: "News",
          href: portalData.knowledgeBaseNewsLink,
        },
        {
          name: "KNIT",
          href: portalData.KNITWebsiteLink,
        },
        {
          name: "Events",
          href: portalData.knowledgeBaseEventsLink,
        },
        {
          name: "Newsletter Signup",
          path: "/community/newsletter-signup"
        },
        {
          name: "Funding Opportunities",
          path: "/community/funding-opportunities"
        },
        {
          name: "Testbeds and Facilities",
          path: "/community/testbeds-and-facilities"
        },
        {
          name: "Cite FABRIC",
          path: "/community/publications"
        },
        {
          name: "FABRIC User Publications",
          path: "/community/fabric-user-publications"
        },
        {
          name: "Blogs",
          href: portalData.knowledgeBaseBlogsLink,
        }
      ],
      path: "/community"
    }
  ] : [
    { 
      name: "Resources",
      path: "/resources",
      child: [
        {
          name: "Resources Overview",
          path: "/resources/overview"
        },
        {
          name: "Measuring and Monitoring Tools",
          path: "/resources/tools"
        }
      ]
    },
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
    { name: "Contact Us", path: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          path: "/about/about-fabric"
        },
        // {
        //   name: "SAC",
        //   path: "/about/sac"
        // },
        {
          name: "Leadership",
          path: "/about/leadership"
        }
      ],
      path: "/about"
    },
    {
      name: "Community",
      child: [
        {
          name: "News",
          href: portalData.knowledgeBaseNewsLink,
        },
        {
          name: "KNIT",
          href: portalData.KNITWebsiteLink,
        },
        {
          name: "Events",
          href: portalData.knowledgeBaseEventsLink,
        },
        {
          name: "Newsletter Signup",
          path: "/community/newsletter-signup"
        },
        {
          name: "Funding Opportunities",
          path: "/community/funding-opportunities"
        },
        {
          name: "Testbeds and Facilities",
          path: "/community/testbeds-and-facilities"
        },
        {
          name: "Cite FABRIC",
          path: "/community/publications"
        },
        {
          name: "FABRIC User Publications",
          path: "/community/fabric-user-publications"
        },
        {
          name: "Blogs",
          href: portalData.knowledgeBaseBlogsLink,
        }
      ],
      path: "/community"
    }
  ]
  
  const handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      // remove old user status stored in browser.
      localStorage.removeItem("userStatus");
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      // nginx handle login url.
      window.location.href = "/login";
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
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

  const location = useLocation();

  return (
    <Navbar expand="lg" className="bg-light">
      <Navbar.Brand href="/">
        <img
          src={getLogoSrc()}
          height="24"
          className="d-inline-block align-top"
          alt=""
        />
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          { 
            navItems.map((item, index) => {
              if (item.child.length === 0) {
                if (item.path) {
                  return <Nav.Link 
                    as={Link} 
                    to={item.path}
                    className={location.pathname.includes(item.path) ? "active" : ""}
                    key={`nav-${index}`}
                    >
                      {item.name}
                  </Nav.Link>
                } else {
                  return <Nav.Link href={item.href} key={`nav-${index}`}>{item.name}</Nav.Link>
                }
              } else {
                return <NavDropdown
                  title={item.name}
                  id={`nav-dropdown-${index}`}
                  className={location.pathname.includes(item.path) ? "active" : ""}
                  key={`nav-${index}`}
                >
                {
                  item.child.map((sub_item, sub_index) => {
                    if (sub_item.path) {
                      return <NavDropdown.Item
                      key={`sub-nav-${sub_index}`}
                      as={Link}
                      to={sub_item.path}>
                        {sub_item.name}
                      </NavDropdown.Item>
                    } else {
                      return <NavDropdown.Item
                      key={`sub-nav-${sub_index}`}
                      href={sub_item.href}>
                        {sub_item.name}
                      </NavDropdown.Item> 
                    }
                   })}
              </NavDropdown>
              }
            })
          }
        </Nav>
        {
        props.userStatus === "active" && !window.location.href.includes("/search-results") &&
        <form className="form-inline d-flex flex-row align-items-center">
          <input
            className="form-control"
            type="search"
            placeholder="Search People/Projects"
            aria-label="Search"
            onChange={props.onQueryChange}
            onKeyDown={raiseInputKeyDown}
          />
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={handleSearch}
          >
              <i className="fa fa-search"></i>
          </button>
         </form>
      }
      { props.userStatus !== "active" ? 
        <form className="form-inline">
          <NavLink to="/login">
            <button
              onClick={handleLogin}
              className="btn btn-outline-success"
            >
              Log in
            </button>
          </NavLink>
          <NavLink to="/signup/1">
            <button
              className="btn btn-outline-primary ms-2"
            >
              Sign up
            </button>
          </NavLink>
        </form> :
        <form className="form-inline">
          <ProfileModal userName={props.userName} userEmail={props.userEmail} />
        </form>
      }
      </Navbar.Collapse>
  </Navbar>
  )
}

export default withRouter(Header);