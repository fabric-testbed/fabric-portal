import React from "react";
import withRouter from "./common/withRouter.jsx";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { default as portalData } from "../services/portalData.json";
import { getCookieConsentValue } from "react-cookie-consent";
import checkPortalType from "../utils/checkPortalType";
import productionLogo from "../imgs/logos/fabric-brand.png";
import alphaLogo from "../imgs/logos/fabric-brand-alpha.png";
import betaLogo from "../imgs/logos/fabric-brand-beta.png";
import ProfileModal from './ProfileModal';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

const Header = (props) => {
  const navItems = (props.globalRoles && !props.globalRoles.isJupterhubUser) ? [
    { 
      name: "Resources",
      href: "/resources",
      child: [
        {
          name: "Testbed Resources",
          href: "/resources/overview"
        },
        {
          name: "Measurement Metrics",
          href: "/resources/tools"
        }
      ]
    },
    {
      name: "Experiments",
      href: "/experiments",
      child: []
    },
    {
      name: "Knowledge Base",
      href: portalData.knowledgeBaseLink,
      child: []
    },
    {
      name: "JupyterHub",
      child: [],
      href: "/jupyter-no-access"
    },
    { name: "Contact Us", href: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          href: "/about/about-fabric"
        },
        {
          name: "SAC",
          href: "/about/sac"
        },
        {
          name: "Leadership",
          href: "/about/leadership"
        }
      ],
      href: "/about"
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
          href: "/community/newsletter-signup"
        },
        {
          name: "Funding Opportunities",
          href: "/community/funding-opportunities"
        },
        {
          name: "Testbeds and Facilities",
          href: "/community/testbeds-and-facilities"
        },
        {
          name: "Cite FABRIC",
          href: "/community/publications"
        },
        {
          name: "FABRIC User Publications",
          href: "/community/fabric-user-publications"
        },
        {
          name: "Blogs",
          href: portalData.knowledgeBaseBlogsLink,
        }
      ],
      href: "/community"
    }
  ] : [
    { 
      name: "Resources",
      href: "/resources",
      child: [
        {
          name: "Resources Overview",
          href: "/resources/overview"
        },
        {
          name: "Measuring and Monitoring Tools",
          href: "/resources/tools"
        }
      ]
    },
    {
      name: "Experiments",
      href: "/experiments",
      child: []
    },
    {
      name: "Knowledge Base",
      href: portalData.knowledgeBaseLink,
      child: []
    },
    {
      name: "JupyterHub",
      href: portalData.jupyterHubLinks[checkPortalType(window.location.href)],
      child: []
    },
    { name: "Contact Us", href: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          href: "/about/about-fabric"
        },
        {
          name: "SAC",
          href: "/about/sac"
        },
        {
          name: "Leadership",
          href: "/about/leadership"
        }
      ],
      href: "/about"
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
          href: "/community/newsletter-signup"
        },
        {
          name: "Funding Opportunities",
          href: "/community/funding-opportunities"
        },
        {
          name: "Testbeds and Facilities",
          href: "/community/testbeds-and-facilities"
        },
        {
          name: "Cite FABRIC",
          href: "/community/publications"
        },
        {
          name: "FABRIC User Publications",
          href: "/community/fabric-user-publications"
        },
        {
          name: "Blogs",
          href: portalData.knowledgeBaseBlogsLink,
        }
      ],
      href: "/community"
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

  return (
    <Navbar expand="lg" className="navbar">
      <Container>
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
                return <Nav.Link href={item.href}>{item.name}</Nav.Link>
              } else {
                return <NavDropdown title={item.name} id={`nav-dropdown-${index}`}>
                {
                  item.child.map((sub_item, sub_index) => {
                    return <NavDropdown.Item
                      key={`sub-nav-${sub_index}`}
                      href={sub_item.href}>
                        {sub_item.name}
                      </NavDropdown.Item> }
                  )}
              </NavDropdown>
              }
            })
          }
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}

export default withRouter(Header);