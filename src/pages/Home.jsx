import React from "react";
import ReactModal from "../components/common/ReactModal";
import FacilityUpdates from "../components/Home/FacilityUpdates";
import HomepageCarousel from "../components/Home/HomepageCarousel.jsx";
import DynamicMetrics from "../components/Home/DynamicMetrics";
import CapabilityIcons from "../components/Home/CapabilityIcons";
import Partners from "../components/Home/Partners";
import { default as portalData } from "../services/portalData.json";
import { sitesNameMapping }  from "../data/sites";
import sitesParser from "../services/parser/sitesParser";
import { NavLink } from "react-router-dom";
import CookieConsent from "react-cookie-consent";
import Topomap from "../components/Resource/Topomap";
import DetailTable from "../components/Resource/DetailTable";
import { getResources } from "../services/resourceService.js";
import { ToastContainer, toast } from "react-toastify";
import checkPortalType from "../utils/checkPortalType";

class Home extends React.Component {
  state = {
    user: {},
    isActiveUser: true,
    resources: [],
    activeDetailName: "StarLight",
    siteNames: [],
    siteColorMapping: {}
  }

  async componentDidMount() {
    try {
      const { data: res } = await getResources(1);
      const parsedObj = sitesParser(res.data[0], sitesNameMapping.acronymToShortName);
      this.setState({
        resources: parsedObj.parsedSites,
        siteNames: parsedObj.siteNames,
        siteColorMapping: parsedObj.siteColorMapping
      });
    } catch (err) {
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }

  getResourceByName = (resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  }

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name });
  }

  render() {
    return (
      <div className="home-container">
        {
          (localStorage.getItem("userStatus") === "inactive") &&
          <div className="self-enroll-container">
            <ReactModal
              id={portalData.selfEnrollRequest.id}
              title={portalData.selfEnrollRequest.title}
              link={portalData.selfEnrollRequest.links[checkPortalType(window.location.href)]}
              content={portalData.selfEnrollRequest.content}
            />
          </div>
        }
        <HomepageCarousel />
        <div className="home-colored-bg">
          <DynamicMetrics />
        </div>
        <div className="home-lower row my-5">
          <div className="col-xl-9 col-lg-12">
            <div className="card homepage-card my-4">
              <div className="card-header text-center">
                <b>Resources</b>
              </div>
              <div className="card-body">
                <div className="row my-2">
                  <div className="col-xl-9 col-lg-8 col-sm-12 mb-4">
                    <Topomap
                      onChange={this.handleActiveDetailChange}
                      sites={this.state.siteNames}
                      siteColorMapping={this.state.siteColorMapping}
                    />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-12">
                    <DetailTable
                      name={this.state.activeDetailName}
                      resource={this.getResourceByName(this.state.resources, sitesNameMapping.shortNameToAcronym[this.state.activeDetailName])}
                      parent="homepage"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12">
            <FacilityUpdates />
          </div>
        </div>
        <div className="home-colored-bg">
          <CapabilityIcons />
        </div>
        <div className="home-lower row mt-2">
          <div className="col-xl-12 col-lg-12">
            <Partners />
          </div>
        </div>
        <CookieConsent
          location="bottom"
          buttonText="OK"
          cookieName="fabricPortalCookieConsent"
        >
          <span className="text-lg">This Website Uses Cookies.</span>
          <div className="mt-1 text-sm">
            We require to use cookies to provide you access to FABRIC testbed resources and to personalize the content of this site. We do not share your personal information with anyone, other than providing anonymous aggregate facility usage statistics to our funders.
            Please accept our Cookie Policy by clicking "OK". For more details, visit the <NavLink className="text-primary-light" to="/cookie-policy"><b>Cookie Policy Page</b></NavLink>.
          </div>
        </CookieConsent>
        <ToastContainer />
      </div>
    );
  }
}

export default Home;