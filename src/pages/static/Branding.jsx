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

const colors = [
  {
    name: "primary",
    hex: "#5798bc"
  },
  {
    name: "primary light",
    hex: "#8ac9ef"
  },
  {
    name: "primary dark",
    hex: "#1f6a8c"
  },
  {
    name: "secondary",
    hex: "#838385"
  },
  {
    name: "success",
    hex: "#008e7a"
  },
  {
    name: "danger",
    hex: "#b00020"
  },
  {
    name: "warning",
    hex: "#ff8542"
  },
  {
    name: "info",
    hex: "#a8c9dc"
  },
  {
    name: "dark",
    hex: "#374955"
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
      <h3 className="text-primary">FABRIC</h3>
      <p>
        We have a few different style and color variations on the FABRIC surface logo design available for download. Feel free to download and use the FABRIC logo that best suits your use case. Note that each of the logos has a transparent background and are optimized for use on either light of dark background colors.
      </p>
      <h4>For Light Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on light background colors.</p>
      <div className="w-100 row">
        {
          lightBgLogos.map((logo, index) => <div
            className="col-sm d-flex flex-column align-items-center"
            key={`light-bg-logo-${index}`}
          >
            <div className="branding-logo-container"><img src={logo.url} className="branding-logo" alt={logo.altText} /></div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h4 className="mt-4">For Dark Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on dark background colors.</p>
      <div className="w-100 row">
        {
          darkBgLogos.map((logo, index) => <div
            className="col-sm d-flex flex-column align-items-center"
            key={`dark-bg-logo-${index}`}
          >
            <div className="branding-logo-container" style={{"backgroundColor": "#666677"}}>
              <img src={logo.url} className="branding-logo" alt={logo.altText} />
            </div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h3 className="mt-4 text-primary">FAB</h3>
      <p>
        Like the FABRIC logo, the FAB Globe logo comes in different variants to suit several use cases. Note that each of the logos has a transparent background and are optimized for use on either light of dark background colors.
      </p>
      <h4 className="mb-3">For Light Backgrounds</h4>
      <p>Each of these logos has a transparent background and are optimized for use on light background colors.</p>
      <div className="w-100 row">
        {
          fabLightBgLogos.map((logo, index) => <div
            className="col-sm-6 d-flex flex-column align-items-center mb-3"
            key={`fab-light-bg-color-${index}`}
          >
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
          fabDarkBgLogos.map((logo, index) => <div
            className="col-sm d-flex flex-column align-items-center mb-3"
            key={`fab-dark-bg-logo-${index}`}
          >
            <div className="branding-logo-container" style={{"backgroundColor": "#666677"}}>
              <img src={logo.url} className="branding-logo" alt={logo.altText} />
            </div>
            <u><a href={ logo.url } target="_blank" rel="noopener noreferrer">Download</a></u>
          </div>)
        }
      </div>
      <h2 className="my-3">
        Portal and Knowledge Base Style
      </h2>
      <h4 className="mb-3 text-primary">
        Topography
      </h4>
      <div className="card">
        <div className="card-header">
          Heading Text - <a
            href="https://fonts.google.com/specimen/Montserrat"
            target="_blank"
            rel="noreferrer"
          >
            <u>Montserrat</u>
          </a>
        </div>
        <div className="card-body">
          <h3>Heading</h3>
          <h4>Subheading</h4>
        </div>
      </div>
      <div className="card mt-3">
        <div className="card-header">
          Body Text - <u><a
            href="https://fonts.google.com/knowledge/glossary/system_font_web_safe_font"
            target="_blank"
            rel="noreferrer"
          >
            system-ui
          </a></u>
        </div>
        <div className="card-body">
          <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dicta fuga deserunt libero, voluptatum non quae suscipit sapiente rem architecto nihil esse soluta odio, quasi aliquid assumenda quo praesentium consectetur aut.</span>
          <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Fugit mollitia quam nam aperiam debitis optio neque delectus rerum, blanditiis perferendis voluptates explicabo dicta, quas error facilis corrupti, ad obcaecati pariatur voluptatem incidunt ipsa impedit. Quis commodi fugiat repellat natus cumque. Quidem eligendi placeat, laborum nulla doloribus harum odio deserunt culpa sapiente. Quam voluptas magnam dolores minus blanditiis fuga quo quibusdam reprehenderit, facere! Quas minima esse earum asperiores facere possimus eligendi tenetur velit, nam delectus odio, beatae sed quisquam iste consequuntur, modi. Qui voluptates, alias nostrum beatae unde sit veniam neque, corporis reiciendis architecto. Cupiditate possimus ea dolor, laudantium in aperiam.</p>
        </div>
      </div>
      <h4 className="mt-3 text-primary">
        Colors
      </h4>
      <div className="row px-3">
        {
          colors.map((color, index) => <div
            className="card col-sm-4 mt-3 branding-color-card"
            key={`branding-color-${index}`}
            >
          <div className="card-header w-100 bg-light">
            { color.name }
          </div>
          <div className="card-body w-100" style={{"backgroundColor": `${color.hex}`}}>
            <div>{ color.hex }</div>
          </div>
        </div>)
        }
      </div>
      {/* <h2 className="my-4">
        FABRIC PR Resources
      </h2>
      <h3 className="mt-3 text-primary">
        PR Resource Branding and Style Guide
      </h3>
      <p>
        Do you want to write about FABRIC or use our branding resources?
        Feel free to download and use our FABRIC logos, and
        consult our <a href="https://www.dropbox.com/s/knsk13dtpy8v83y/2019_NRIG_FABRIC%20Style%20Guide%20V2.pdf?dl=0" target="_blank" rel="noopener noreferrer">Branding & Style Guide</a> to
        see how to best utilize FABRIC brand assets, including our logos, colors, typography.
      </p>
      <h3 className="text-primary">
        Graphics
      </h3>
      <p>We make detailed graphics to illustrate features for FABRIC. They are made publicly accessible, so feel free to use the graphics below to help spread the word about FABRIC.</p> */}
    </div>
  );
};

export default Branding;
