import React from "react";
import { homepageIntro } from "../services/portalData.json";
import { getUpdates } from "../services/fakeFacilityUpdate";

class Home extends React.Component {
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
          <div className="card">
            <div className="card-header">
              <b>Facility Update</b>
            </div>
            <div className="card-body">
              <div className="update-1 pb-4 border-bottom">
                <h6 className="card-title">2020-11-06</h6>
                <h5 className="card-title">Title for the update</h5>
                <p className="card-text">
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Vestibulum tortor quam,
                  feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
                  libero sit amet quam egestas semper...
                </p>
                <a href="#" className="btn btn-primary">
                  Read More
                </a>
              </div>
              <div className="update-1 pt-4">
                <h6 className="card-title">2020-11-06</h6>
                <h5 className="card-title">Title for the update</h5>
                <p className="card-text">
                  Pellentesque habitant morbi tristique senectus et netus et
                  malesuada fames ac turpis egestas. Vestibulum tortor quam,
                  feugiat vitae, ultricies eget, tempor sit amet, ante. Donec eu
                  libero sit amet quam egestas semper...
                </p>
                <a href="#" className="btn btn-primary">
                  Read More
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Home;
