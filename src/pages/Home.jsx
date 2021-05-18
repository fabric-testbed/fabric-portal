import React from "react";

import CardOfItems from "../components/common/CardOfItems";
import ReactModal from "../components/common/ReactModal";

import { selfEnrollRequest } from "../services/portalData.json";
import { getLatestUpdates } from "../services/fakeFacilityUpdate";

import { NavLink } from "react-router-dom";

import CookieConsent from "react-cookie-consent";

class Home extends React.Component {
  state = {
    user: {},
    isActiveUser: true,
  }

  render() {
    return (
      <div className="home-container">
        {
          (localStorage.getItem("userStatus") === "inactive") &&
          <div className="self-enroll-container">
            <ReactModal
              id={selfEnrollRequest.id}
              title={selfEnrollRequest.title}
              link={selfEnrollRequest.link}
              content={selfEnrollRequest.content}
            />
          </div>
        }
        <div className="home-upper">
          <div className="home-upper-text">
            <h1>FABRIC Portal</h1>
            <p>FABRIC portal is your guide, helping make your experiment a success.</p>
            <ul>
              <li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li>
              <li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li>
              <li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li>
            </ul>
            <a
              href="https://fabric-testbed.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn btn-warning">Learn More</button>
            </a>
          </div>
        </div>
        <div className="home-lower">
          <CardOfItems header={"Facility Updates"} data={getLatestUpdates(2)} />
        </div>
        <CookieConsent
          location="bottom"
          buttonText="OK"
          cookieName="cookieConsent"
          onAccept={() => {
            localStorage.setItem("cookieConsent", true)
          }}
        >
          <span className="text-lg">This Website Uses Cookies.</span>
          <div className="mt-1 text-sm">
          We require to use cookies to provide you access to FABRIC testbed resources and to personalize the content of this site. We do not share your personal information with anyone, other than providing anonymous aggregate facility usage statistics to our funders.
          Please accept our Cookie Policy by clicking ‘OK’. For more details, visit the <NavLink className="text-primary-light" to="/cookiepolicy"><b>Cookie Policy Page</b></NavLink>. 
          </div>
        </CookieConsent>
      </div>
    );
  }
}

export default Home;
