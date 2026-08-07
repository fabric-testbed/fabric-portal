"use client"; 
import React from "react";
import { usePathname, useRouter } from "next/navigation"
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { default as portalData } from "../services/portalData.json";
import { getCookieConsentValue } from "react-cookie-consent";
import checkPortalType from "@/lib/permissions/checkPortalType";
import { clearSession } from "@/utils/sessionCookies";
import ProfileModal from './ProfileModal';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Link from "next/link";
import { Search, ExternalLink } from "lucide-react";

const Header = (props) => {
  const router = useRouter();

  const handleLogout = () => {
    clearSession();
    window.location.replace('/logout?url=' + encodeURIComponent(window.location.origin));
  };
  const navItems = (props.globalRoles && props.globalRoles.isActiveUser && !props.globalRoles.isJupterhubUser) ? [
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
      name: "LoomAI",
      href: "https://loomai.fabric-testbed.net/hub/login",
      child: [],
      path: ""
    },
    {
      name: "JupyterHub",
      child: [],
      path: "/experiments/jupyter-no-access"
    },
    { name: "Contact Us", path: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          href: "https://www.whatisfabric.net/about",
        },
        {
          name: "Leadership",
          href: "https://www.whatisfabric.net/about/leadership",
        }
      ],
      path: "/about"
    },
    {
      name: "Community",
      child: [
        {
          name: "KNIT",
          href: portalData.KNITWebsiteLink,
        },
        {
          name: "Events & Workshops",
          href: portalData.eventsAndWorkshopsLink,
        },
        {
          name: "News & Blogs",
          href: portalData.newsAndBlogsLink,
        },
        {
          name: "Newsletter Signup",
          href: portalData.newsletterSignupLink,
        },
        {
          name: "Funding Opportunities",
          href: portalData.fundingOpportunitiesLink,
        },
        {
          name: "Testbeds and Facilities",
          href: portalData.testbedsAndFacilitiesLink,
        },
        {
          name: "Cite FABRIC",
          href: portalData.citeFabricLink,
        },
        {
          name: "FABRIC User Publications",
          href: portalData.fabricUserPublicationsLink,
        },
        {
          name: "REU Site",
          href: portalData.ReuSiteWebsiteLink,
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
      name: "LoomAI",
      href: "https://loomai.fabric-testbed.net/hub/login",
      child: [],
      path: ""
    },
    {
      name: "JupyterHub",
      href: typeof window !== "undefined" && portalData.jupyterHubLinks[checkPortalType(window.location.href)],
      child: [],
      path: ""
    },
    { name: "Contact Us", path: "/help", child: [] },
    {
      name: "About",
      child: [
        {
          name: "Overview",
          href: "https://www.whatisfabric.net/about",
        },
        {
          name: "Leadership",
          href: "https://www.whatisfabric.net/about/leadership",
        }
      ],
      path: "/about"
    },
    {
      name: "Community",
      child: [
        {
          name: "KNIT",
          href: portalData.KNITWebsiteLink,
        },
        {
          name: "Events & Workshops",
          href: portalData.eventsAndWorkshopsLink,
        },
        {
          name: "News & Blogs",
          href: portalData.newsAndBlogsLink,
        },
        {
          name: "Newsletter Signup",
          href: portalData.newsletterSignupLink,
        },
        {
          name: "Funding Opportunities",
          href: portalData.fundingOpportunitiesLink,
        },
        {
          name: "Testbeds and Facilities",
          href: portalData.testbedsAndFacilitiesLink,
        },
        {
          name: "Cite FABRIC",
          href: portalData.citeFabricLink,
        },
        {
          name: "FABRIC User Publications",
          href: portalData.fabricUserPublicationsLink,
        },
        {
          name: "REU Site",
          href: portalData.ReuSiteWebsiteLink,
        }
      ],
      path: "/community"
    }
  ]
  
  const handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      // Clear cached session so AuthContext calls whoAmI fresh after returning from login
      clearSession();
      window.location.href = "/login?url=" + encodeURIComponent(window.location.origin + "/");
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  }
  
  const getLogoSrc = () => {
    const portal = (typeof window !== "undefined") && checkPortalType(window.location.href);
    if (portal === "alpha") {
      return "/imgs/logos/fabric-brand-alpha.png";
    }
    if (portal === "beta") {
      return "/imgs/logos/fabric-brand-beta.png";
    }
    return "/imgs/logos/fabric-brand.png";
  }

  const handleSearch = () => {
    const q = props.searchQuery?.trim();
    if (q) router.push(`/search-results?query=${encodeURIComponent(q)}`);
  };

  const raiseInputKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const val = e.target.value.trim();
      if (val) router.push(`/search-results?query=${encodeURIComponent(val)}`);
    }
  };

  const pathname = usePathname();

  return (
    <Navbar expand="lg" style={{ backgroundColor: "#f8f9fa" }}>
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
            navItems.length > 0 && navItems.map((item, index) => {
              if (item.child.length === 0) {
                if (item.href) {
                  return  <Nav.Link href={item.href} target="_blank" rel="noopener noreferrer" key={`nav-item-${index}`}>{item.name} <ExternalLink size={12} /></Nav.Link>
                } else if (item.path) {
                  return <Nav.Link
                    as={Link}
                    href={item.path}
                    className={pathname.includes(item.path) ? "active" : ""}
                    key={`nav-item-${index}`}
                  >
                    {item.name}
                  </Nav.Link>
                }
              } else {
                return <NavDropdown
                  title={item.name}
                  id={`nav-dropdown-${index}`}
                  className={pathname.includes(item.path) ? "active" : ""}
                  key={`nav-dropdown-${index}`}
                  renderMenuOnMount
                >
                {
                  item.child.map((sub_item, sub_index) => {
                    if (sub_item.path) {
                      return <NavDropdown.Item
                      key={`sub-nav-${sub_index}`}
                      as={Link}
                      href={sub_item.path}>
                        {sub_item.name}
                      </NavDropdown.Item>
                    } else {
                      return <NavDropdown.Item
                      key={`sub-nav-${sub_index}`}
                      href={sub_item.href}
                      target="_blank"
                      rel="noopener noreferrer">
                        {sub_item.name} <ExternalLink size={12} />
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
        <form className="form-inline d-flex flex-row align-items-center" onSubmit={(e) => e.preventDefault()}>
          <input
            className="form-control"
            type="search"
            placeholder="Search People/Projects"
            aria-label="Search"
            style={{ minWidth: "180px" }}
            value={props.searchQuery || ""}
            onChange={props.onQueryChange}
            onKeyDown={raiseInputKeyDown}
          />
          <button
            className="btn btn-sm btn-outline-secondary"
            type="button"
            onClick={handleSearch}
          >
            <Search size={20}/>
          </button>
         </form>
      }
      { props.userStatus !== "active" ?
        <form className="form-inline d-flex flex-row align-items-center">
          <button
            type="button"
            onClick={handleLogin}
            className="btn btn-outline-primary"
          >
            Log in
          </button>
          <Link href="/signup/1">
            <button
              className="btn btn-outline-primary ms-2"
            >
              Sign up
            </button>
          </Link>
        </form> :
        <>
          <form className="form-inline d-none d-lg-block">
            <ProfileModal userName={props.userName} userEmail={props.userEmail} />
          </form>
          <div className="d-lg-none d-flex flex-row align-items-center gap-2 px-3 py-2">
            <Link href="/user" className="btn btn-sm btn-outline-primary">
              User Profile
            </Link>
            <button className="btn btn-sm btn-outline-success" onClick={handleLogout}>
              Log out
            </button>
          </div>
        </>
      }
      </Navbar.Collapse>
  </Navbar>
  )
}

export default Header;