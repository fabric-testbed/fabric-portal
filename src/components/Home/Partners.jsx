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
import Usignite from "../../imgs/partners/usignite.png";
import UVA from "../../imgs/partners/uva.png";
import Slider from 'infinite-react-carousel';

const Partners = () => {
  const corePartnerLogos = [UK, Clemson, UIUC, Esnet];

  const partnerLogos = [Columbia, Utah, NCSA, FIU, GT, Internet2, Rutgers, SRI,
    TACC, Uchicago, UCSD, Usignite, UVA];

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
          className="d-inline-block align-top mr-4"
          alt=""
        />
        {
          corePartnerLogos.map((logo, index) =>  
            <img
              src={logo}
              key={`partners-logo-${index}`}
              height="65"
              className="d-inline-block align-top mx-4"
              alt={`fabricPartnerLogo${logo}`}
            />
          )
        }
      </div>
      <div className="homepage-scroll-container">
        <Slider
          autoPlay={true}
          autoplaySpeed={1000}
          autoplayScroll={5}
          pauseOnHover={true}
          dots={false}
          slidesPerRow={5}
          centerMode={true}
          adaptiveHeight={true}
          duration={100}
        >
          {
            partnerLogos.map((logo, index) =>  
            <div
              className="homepage-scroll-box"
              key={`partners-logo-${index}`}
            >
              <img
                src={logo}
                height="30"
                className="mx-2"
                alt={`fabricPartnerLogo${logo}`}
              />
            </div>
            )
          }
        </Slider>
      </div>
    </div>
  );
};

export default Partners;