import React from "react";
import RENCI from "../../imgs/partners/renci.png";
import UK from "../../imgs/partners/uk.png";
import Clemson from "../../imgs/partners/clemson.png";
import UIUC from "../../imgs/partners/university-of-illinios.png";
import Esnet from "../../imgs/partners/esnet.png";
import Columbia from "../../imgs/partners/columbia.png";
import Utah from "../../imgs/partners/utah.png";
import NCSA from "../../imgs/partners/ncsa.png";
import FIU from "../../imgs/partners/fiu.png";
import GT from "../../imgs/partners/gt.png";
import Internet2 from "../../imgs/partners/internet2.png";
import Rutgers from "../../imgs/partners/rutgers.png";
import SRI from "../../imgs/partners/sri.png";
import TACC from "../../imgs/partners/tacc.png";
import Uchicago from "../../imgs/partners/uchicago.png";
import UCSD from "../../imgs/partners/ucsd.png";
import SDSC from "../../imgs/partners/sdsc.png";
import Usignite from "../../imgs/partners/usignite.png";
import UVA from "../../imgs/partners/uva.png";
import Starlight from "../../imgs/partners/starlight.png";
import IndianaU from "../../imgs/partners/indiana-university.png";
import Maxgigapop from "../../imgs/partners/maxgigapop.png";
import UofMich from "../../imgs/partners/university-of-michiagan.png";
import UofMass from "../../imgs/partners/university-of-massachusetts-amherst.png";
import MGHPCC from "../../imgs/partners/mghpcc.png";
import UMKC from "../../imgs/partners/umkc.png";
import PrincetonUniversity from "../../imgs/partners/princeton-university.png";
import PSC from "../../imgs/partners/psc.png";
import UofBristol from "../../imgs/partners/university-of-bristol.png";
import UofAmsterdam from "../../imgs/partners/university-of-amsterdam.png";
import UofTokyo from "../../imgs/partners/university-of-tokyo.png";
import UofHawaii from "../../imgs/partners/university-of-hawaii.png";
import Chameleon from "../../imgs/partners/chameleon.png";
import Cloudlab from "../../imgs/partners/cloudlab.png";
import Cosmos from "../../imgs/partners/cosmos.png";
import Powder from "../../imgs/partners/powder.png";
import Peering from "../../imgs/partners/peering.png";
import NJEdge from "../../imgs/partners/NJEdge.png";
import CENIC from "../../imgs/partners/cenic.png";
import GPN from "../../imgs/partners/GPN.png";
import CERN from "../../imgs/partners/cern.png";
import MERIT from "../../imgs/partners/merit.png";

const Partners = () => {
  const corePartnerLogos = [UK, Clemson, UIUC, Esnet];

  const partnerLogos = [Utah, NCSA, FIU, GT, Internet2, Rutgers,
    TACC, Uchicago, UCSD, SDSC, Usignite, UVA, Starlight, IndianaU, Maxgigapop,
    UofMass, MGHPCC, UofMich, UMKC, PrincetonUniversity, PSC, UofBristol, UofAmsterdam, 
    UofTokyo, UofHawaii, Chameleon, Cloudlab, Cosmos, Columbia, Peering, Powder, NJEdge,
    CENIC, GPN, CERN, MERIT, SRI];

  return (
    <div className="my-3 d-flex flex-column justify-content-center align-items-center">
      <div className="my-2">
        <span className="homepage-partner-header">Our Partners</span>
      </div>
      <span className="homepage-partner-text">FABRIC is made possible by collaborations with the following organizations.</span>
      <div className="homepage-partner-logo-containter">
        <img
          src={RENCI}
          key={`partners-logo-renci`}
          height="95"
          className="d-inline-block align-top me-4"
          alt=""
        />
        {
          corePartnerLogos.map((logo, index) =>  
            <img
              src={logo}
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
              src={logo}
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