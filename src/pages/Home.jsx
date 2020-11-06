import React from "react";

class Home extends React.Component {
  render() {
    return (
      <div className="home-container">
        <div className="home-upper">
          <div
            className="home-upper-text"
            // style={{
            //   background: `url(${bg})`,
            // }}
          >
            <h1>FABRIC Portal</h1>
            <p>
              Pellentesque habitant morbi tristique senectus et netus et
              malesuada fames ac turpis egestas. Vestibulum tortor quam, feugiat
              vitae, ultricies eget, tempor sit amet, ante. Donec eu libero sit
              amet quam egestas semper. Aenean ultricies mi vitae est. Mauris
              placerat eleifend leo. fames ac turpis egestas. Vestibulum tortor
              quam, feugiat vitae, ultricies eget, tempor sit amet, ante. Donec
              eu libero sit amet quam egestas semper. Aenean ultricies mi vitae
              est. Mauris placerat eleifend leo.
            </p>
            <button className="btn btn-warning">Learn More</button>
          </div>
        </div>
        <div className="home-lower"></div>
      </div>
    );
  }
}

export default Home;
