import React from "react";
import ReactModal from "../components/common/ReactModal";
import FacilityUpdates from "../components/Home/FacilityUpdates";
import RecentNews from "../components/Home/RecentNews";
// import TwitterFeed from "../components/Home/TwitterFeed";
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
import bg1 from "../imgs/homepage/bg1.jpeg";
import bg2 from "../imgs/homepage/bg2.jpeg";
import bg3 from "../imgs/homepage/bg3.jpeg";


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
      const { data: res } = await getResources();
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
        <div
          id="homepageCarouselIndicators"
          className="carousel slide homepage-carousel"
          data-ride="carousel"
        >
          <ol className="carousel-indicators">
            <li data-target="#homepageCarouselIndicators" data-slide-to="0" className="active"></li>
            <li data-target="#homepageCarouselIndicators" data-slide-to="1"></li>
            <li data-target="#homepageCarouselIndicators" data-slide-to="2"></li>
          </ol>
          <div className="carousel-inner">
            <div className="carousel-item active">
              <img src={bg1} alt={`FABRIC Portal Homepage Slide 1`} className="d-block w-100"/>
              <div className="carousel-caption d-none d-md-block">
                <div className="carousel-caption-content">
                  <h3>FABRIC Portal is your guide, helping make your experiment a success.</h3>
                  <ul>
                    <li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li>
                    <li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li>
                    <li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li>
                  </ul>
                  <NavLink to="/about/about-fabric">
                    <button className="btn btn-sm btn-warning">Learn More</button>
                  </NavLink>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bg2} alt={`FABRIC Portal Homepage Slide 2`} className="d-block w-100"/>
              <div className="carousel-caption d-none d-md-block">
                <div className="carousel-caption-content">
                  <h3>
                    NGI Enrichers program seeks host organizations for funded researchers
                  </h3>
                  <p>
                    Next Generation Internet (NGI) Enrichers is an initiative that supports transatlantic research cooperation in areas related to the next generation of the internet, such as networking, cybersecurity, virtual reality, 5G, machine learning, and several others.
                  </p>
                  <a
                    href="https://fabric-testbed.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="btn btn-sm btn-warning">Learn More</button>
                  </a>
                </div>
              </div>
            </div>
            <div className="carousel-item">
              <img src={bg3} alt={`FABRIC Portal Homepage Slide 3`} className="d-block w-100"/>
              <div className="carousel-caption d-none d-md-block">
                <div className="carousel-caption-content">
                  <h3>
                    NSF FABRIC Project Completes Phase 1, Enabling Early Testing of Unprecedented Large-scale Network Experiments
                  </h3>
                  <p>
                    The NSF-funded FABRIC project has made steady progress establishing the groundbreaking network testbed infrastructure to reimagine the way large amounts of data are generated, stored, analyzed, and transmitted across the world.
                  </p>
                  <a
                    href="https://fabric-testbed.net/"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <button className="btn btn-sm btn-warning">Learn More</button>
                  </a>
                </div>
              </div>
            </div>
          </div>
          <a className="carousel-control-prev" href="#homepageCarouselIndicators" role="button" data-slide="prev">
            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
            <span className="sr-only">Previous</span>
          </a>
          <a className="carousel-control-next" href="#homepageCarouselIndicators" role="button" data-slide="next">
            <span className="carousel-control-next-icon" aria-hidden="true"></span>
            <span className="sr-only">Next</span>
          </a>
        </div>
        <div className="home-lower row">
          <div className="col-xl-9 col-lg-12">
            <div className="card homepage-card mb-4">
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
        <div className="home-lower row mt-2">
          <div className="col-xl-12 col-lg-12">
            <RecentNews />
          </div>
          {/* <div className="col-xl-3 col-lg-12">
            <TwitterFeed />
          </div> */}
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