import React from "react";

import CardOfItems from "../components/common/CardOfItems";

import { homepageIntro } from "../services/portalData.json";
import { getUpdates } from "../services/fakeFacilityUpdate";
import { getLatestUpdates } from "../services/fakeFacilityUpdate";

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
      </div>
    );
  }
}

export default Home;
