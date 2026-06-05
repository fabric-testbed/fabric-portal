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
    <div className="partners-section">
      <div className="partners-heading">
        <h2 className="homepage-partner-header">Our Partners</h2>
        <p className="homepage-partner-text">FABRIC is made possible by collaborations with the following organizations.</p>
      </div>
      <div className="partners-core-logos">
        <img
          src="/imgs/partners/renci.png"
          key={`partners-logo-renci`}
          className="partner-logo-core partner-logo-lead"
          alt="RENCI"
        />
        {
          corePartnerLogos.map((logo, index) =>
            <img
              src={`/imgs/partners/${logo}`}
              key={`partners-logo-${index}`}
              className="partner-logo-core"
              alt={`fabricPartnerLogo${logo}`}
            />
          )
        }
      </div>
      <div className="partners-other-logos">
        {
          partnerLogos.map((logo, index) =>
            <img
              key={`partner-logo-${index}`}
              src={`/imgs/partners/${logo}`}
              className="partner-logo-other"
              alt={`fabricPartnerLogo${logo}`}
            />
          )
        }
      </div>
    </div>
  );
};

export default Partners;