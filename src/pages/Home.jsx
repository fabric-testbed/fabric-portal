import React from "react";

import CardOfItems from "../components/common/CardOfItems";

import { homepageIntro } from "../services/portalData.json";
import { getLatestUpdates } from "../services/fakeFacilityUpdate";

import CookieConsent from "react-cookie-consent";

class Home extends React.Component {
  state = {
    updates: getLatestUpdates(2),
  };

  render() {
    return (
      <div className="home-container">
        <div className="home-upper">
          <div className="home-upper-text">
            <h1>FABRIC Portal</h1>
            <p>{homepageIntro}</p>
            <button className="btn btn-warning">Learn More</button>
          </div>
        </div>
        <div className="home-lower">
          <CardOfItems header={"Facility Updates"} data={this.state.updates} />
        </div>
        <CookieConsent
          location="bottom"
          buttonText="OK"
          cookieName="cookieConsent"
          onAccept={() => {
            localStorage.setItem("cookieConsent", true)
          }}
        >
          This Website Uses Cookies.
          <div className="mt-1 text-sm">
            We use cookies to provide you access to FABRIC Resources and
            to personalize the content of this site. Your information
            comes to us by way of your selected Identity Provider,
            which is most likely your home institution. We do not share
            your personal information with anyone, other than providing
            aggregate statistics to our funders.
          </div>
        </CookieConsent>
      </div>
    );
  }
}

export default Home;
