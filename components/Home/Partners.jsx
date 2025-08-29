import React from "react";

const Partners = () => {
  const corePartnerLogos = ["uk.png", "clemson.png", "university-of-illinios.png", "esnet.png"]

  const partnerLogos = [
    "columbia.png",
    "utah.png",
    "ncsa.png",
    "fiu.png",
    "gt.png",
    "internet2.png",
    "rutgers.png",
    "sri.png",
    "tacc.png",
    "uchicago.png",
    "ucsd.png",
    "sdsc.png",
    "usignite.png",
    "uva.png",
    "starlight.png",
    "indiana-university.png",
    "maxgigapop.png",
    "university-of-michiagan.png",
    "university-of-massachusetts-amherst.png",
    "mghpcc.png",
    "umkc.png",
    "princeton-university.png",
    "psc.png",
    "university-of-bristol.png",
    "university-of-amsterdam.png",
    "university-of-tokyo.png",
    "university-of-hawaii.png",
    "chameleon.png",
    "cloudlab.png",
    "cosmos.png",
    "powder.png",
    "peering.png",
    "NJEdge.png",
    "cenic.png",
    "GPN.png",
    "cern.png",
    "merit.png"
  ];  

  return (
    <div className="my-3 d-flex flex-column justify-content-center align-items-center">
      <div className="my-2">
        <span className="homepage-partner-header">Our Partners</span>
      </div>
      <span className="homepage-partner-text">FABRIC is made possible by collaborations with the following organizations.</span>
      <div className="homepage-partner-logo-containter">
        <img
          src="/imgs/partners/renci.png"
          key={`partners-logo-renci`}
          height="95"
          className="d-inline-block align-top me-4"
          alt=""
        />
        {
          corePartnerLogos.map((logo, index) =>  
            <img
              src={`/imgs/partners/${logo}`}
              key={`partners-logo-${index}`}
              height="55"
              className="d-inline-block align-top mx-4"
              alt={`fabricPartnerLogo${logo}`}
            />
          )
        }
      </div>
      <div className="mt-5 px-5">
        {
          partnerLogos.map((logo, index) =>  
            <img
              key={`partner-logo-${index}`}
              src={`/imgs/partners/${logo}`}
              height="30"
              className="mx-4 my-3"
              alt={`fabricPartnerLogo${logo}`}
            />
          )
        }
      </div>
    </div>
  );
};

export default Partners;