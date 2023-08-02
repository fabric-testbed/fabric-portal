import React from "react";
import RENCI from "../../imgs/partners/renci.png";
import UK from "../../imgs/partners/uk.png";
import Clemson from "../../imgs/partners/clemson.png";
import UIUC from "../../imgs/partners/university-of-illinios.png";
import Esnet from "../../imgs/partners/esnet.png";

const Partners = () => {
  const corePartnerLogos = [UK, Clemson, UIUC, Esnet];

  const partnerLogos = [
    'columbia.png',
    'utah.png',
    'ncsa.png',
    'fiu.png',
    'gt.png',
    'internet2.png',
    'rutgers.png',
    'sri.png',
    'tacc.png',
    'uchicago.png',
    'ucsd.png',
    'usignite.png',
    'uva.png',
  ];

  return (
    <div className="my-3 d-flex flex-column justify-content-center align-items-center">
      <div className="mb-2">
        <span className="homepage-partner-header">Our Partners</span>
      </div>
      <span className="homepage-partner-text">FABRIC is made possible by collaborations with the following organizations.</span>
      <div className="homepage-partner-logo-containter">
        <img
          src={RENCI}
          key={`partners-logo-renci`}
          height="105"
          className="d-inline-block align-top"
          alt=""
        />
        {
          corePartnerLogos.map((logo, index) =>  
            <img
              src={logo}
              key={`partners-logo-${index}`}
              height="65"
              className="d-inline-block align-top ml-4"
              alt=""
            />
          )
        }
      </div>
    </div>
  );
};

export default Partners;