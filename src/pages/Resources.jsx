import React from "react";
import LoadSpinner from "../components/common/LoadSpinner";

const Resources = () => {
  return (
  <div className="container">
    Resources
    <LoadSpinner text={"Creating Project..."} showSpinner={false} />
  </div>
  );
};

export default Resources;
