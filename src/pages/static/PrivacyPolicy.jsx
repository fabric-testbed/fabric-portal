import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";
import UnderConstruction from "../../components/common/UnderConstruction";

const PrivacyPolicy = () => {
  return (
    <div className="container">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1>Privacy Policy</h1>
      <UnderConstruction />
    </div>
  );
};

export default PrivacyPolicy;
