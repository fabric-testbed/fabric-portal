import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";

const lightBgLogos = [
  {
    url: "https://www.dropbox.com/s/26lsgihw277bfgm/2019_NRIG_FABRIC%20logo%20Dark.png?raw=1",
    altText: "Fabric logo with text below surface"
  },
  {
    url: "https://www.dropbox.com/s/p02zqsutv991iel/2019_NRIG_Fabric%20dark%20text%20right.png?raw=1",
    altText: "Fabric logo with text beside surface"
  },
  {
    url: "https://www.dropbox.com/s/8rnpjckb4auct03/2019_NRIG_Fabric%20dark%20wave.png?raw=1",
    altText:"Fabric surface logo without text"
  }
]

const darkBgLogos = [
  {
    url: "https://www.dropbox.com/s/1gz57gt3tn7nxkh/2019_NRIG_FABRIC%20logo%20light.png?raw=1",
    altText: "Fabric logo with text below surface"
  },
  {
    url: "https://www.dropbox.com/s/mbuk7mgkrni17fe/2019_NRIG_Fabric%20light%20text%20right.png?raw=1",
    altText: "Fabric logo with text beside surface"
  },
  {
    url: "https://www.dropbox.com/s/a43hdnx08evxp3i/2019_NRIG_Fabric%20white%20wave.png?raw=1",
    altText: "Fabric surface logo without text"
  }
]

const fabLightBgLogos = [
  {
    url: "https://www.dropbox.com/s/4cw1nuxsavva1u2/New%20FAB%20Official%20Logo_Color.png?raw=1",
    altText: "FAB Globe with text - Color"
  },
  {
    url: "https://www.dropbox.com/s/v8k3spmrhpwknff/New%20FAB%20Official%20Logo_Dark.png?raw=1",
    altText: "FAB Globe with text - Black only"
  },
  {
    url: "https://www.dropbox.com/s/lns4mkwnd8oc71b/202101_FAB_globe%20icon%20color%40300x.png?raw=1",
    altText: "FAB Globe"
  },
  {
    url: "https://www.dropbox.com/s/iigjdmo4e81eink/202101_FAB_%20globe%20icon_DARK%40300x.png?raw=1",
    altText: "FAB Globe"
  }
]

const fabDarkBgLogos = [
  {
    url: "https://www.dropbox.com/s/7nydw2bxffkubji/New%20FAB%20Official%20Logo_light.png?raw=1",
    altText: "FAB Globe"
  },
  {
    url: "https://www.dropbox.com/s/fa16l6knrgdhp9s/202101_FAB_Globe%20icon_light%40300x.png?raw=1",
    altText: "FAB Globe"
  },
  {
    url: "https://www.dropbox.com/s/0vq767ba2ksd0b9/202101_FAB_Globe%20Icon_Color%20light%40300x.png?raw=1",
    altText: "FAB Globe"
  }
]

const Branding = () => {
  return (
    <div className="container pb-5 static-page">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">FABRIC Branding Resources</h1>
      <h2 className="mb-3">
        Logos
      </h2>
      <h3>FABRIC</h3>
      <p>
        We have a few different style and color variations on the FABRIC surface logo design available for download. Feel free to download and use the FABRIC logo that best suits your use case. Note that each of the logos has a transparent background and are optimized for use on either light of dark background colors.
      </p>
      <h4>For Light Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on light background colors.</p>
      <div className="w-100 row">
        {
          lightBgLogos.map((logo, index) => <div className="col-sm d-flex flex-column align-items-center">
            <div className="branding-logo-container"><img src={logo.url} className="branding-logo" alt={logo.altText} /></div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h4 className="mt-4">For Dark Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on dark background colors.</p>
      <div className="w-100 row">
        {
          darkBgLogos.map((logo, index) => <div className="col-sm d-flex flex-column align-items-center">
            <div className="branding-logo-container" style={{"background-color": "#666677"}}>
              <img src={logo.url} className="branding-logo" alt={logo.altText} />
            </div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h3 className="mt-4">FAB</h3>
      <p>
        Like the FABRIC logo, the FAB Globe logo comes in different variants to suit several use cases. Note that each of the logos has a transparent background and are optimized for use on either light of dark background colors.
      </p>
      <h4 className="mb-3">For Light Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on light background colors.</p>
      <div className="w-100 row">
        {
          fabLightBgLogos.map((logo, index) => <div className="col-sm-6 d-flex flex-column align-items-center mb-3">
            <div className="branding-logo-container">
              <img src={logo.url} className="branding-logo" alt={logo.altText} />
            </div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h4 className="mt-4">For Dark Backgrounds</h4>
      <p>Each of thes logos has a transparent background and are optimized for use on dark background colors.</p>
      <div className="w-100 row">
        {
          fabDarkBgLogos.map((logo, index) => <div className="col-sm d-flex flex-column align-items-center mb-3">
            <div className="branding-logo-container" style={{"background-color": "#666677"}}>
              <img src={logo.url} className="branding-logo" alt={logo.altText} />
            </div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
    </div>
  );
};

export default Branding;
