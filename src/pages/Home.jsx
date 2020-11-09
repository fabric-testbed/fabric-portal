import React from "react";
import { homepageIntro } from "../services/portalData.json";
import { getUpdates } from "../services/fakeFacilityUpdate";

class Home extends React.Component {
  state = {
    updates: getUpdates().slice(0, 2),
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
          <div className="card">
            <div className="card-header">
              <b>Facility Update</b>
            </div>
            <div className="card-body p-0">
              <div className="p-4 mx-4 border-bottom">
                <h6 className="card-title">{this.state.updates[0].date}</h6>
                <h5 className="card-title">{this.state.updates[0].title}</h5>
                <p className="card-text">{this.state.updates[0].content}</p>
                <a href={this.state.updates[0].id} className="btn btn-primary">
                  Read More
                </a>
              </div>
              <div className="p-4 mx-4">
                <h6 className="card-title">{this.state.updates[1].date}</h6>
                <h5 className="card-title">{this.state.updates[1].title}</h5>
                <p className="card-text">{this.state.updates[1].content}</p>
                <a href={this.state.updates[1].id} className="btn btn-primary">
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
