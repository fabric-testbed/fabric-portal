import React from "react";
import image from "../../assets/imgs/under-construction.png";

const UnderConstruction = () => {
  return (
    <div className="d-flex flex-column align-items-start justify-content-center">
      <img
        src={image}
        width="350"
        height="350"
        className="d-inline-block align-top my-4"
        alt=""
      />
      <h4>THIS PAGE IS UNDER CONSTRUCTION.</h4>
    </div>)
  ;
};

export default UnderConstruction;
