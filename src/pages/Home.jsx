import React from "react";

import CardOfItems from "../components/common/CardOfItems";
import ReactModal from "../components/common/ReactModal";

import { selfEnrollRequest } from "../services/portalData.json";
import { homepageIntro } from "../services/portalData.json";
import { getLatestUpdates } from "../services/fakeFacilityUpdate";
import { getWhoAmI } from "../services/userInformationService.js";

import { hasCookie } from "../services/dummyAuth";

import CookieConsent from "react-cookie-consent";

class Home extends React.Component {
  state = {
    user: {},
    isActiveUser: true,
  }

  async componentDidMount(){
    if (hasCookie("fabric-service")) {
      try {
        const { data: user } = await getWhoAmI();
        localStorage.setItem("userID", user.uuid);
      } catch(err) {
        console.log("/whoami " + err);
        // not actice user, show self-enrollment modal
        this.setState({ isActiveUser: false })
      }
    }
  }

  render() {
    return (
      <div className="home-container">
        {
          (!this.state.isActiveUser && hasCookie("fabric-service"))&&
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
            <p>{homepageIntro}</p>
            <button className="btn btn-warning">Learn More</button>
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
