import React from "react";
import iconEducation from "../../imgs/capabilities/education.png";
import iconInternet from "../../imgs/capabilities/internet.png";
import iconIot from "../../imgs/capabilities/iot.png";
import iconMachineLearning from "../../imgs/capabilities/machine-learning.png";
import iconSecurity from "../../imgs/capabilities/security.png";
import BackgroundImage from "../../imgs/network-bg.svg";
import nsfLogo from "../../imgs/nsf.png";
import FABMap from "../../imgs/fab-map.png";
import { default as portalData } from "../../services/portalData.json";

const nsfAwardNumbers = [1935966, 2029176, 2029200, 2029235, 2029260, 2029261, 2330891];
const teamMembers = [
  {
    name: "Paul Ruth",
    org: "RENCI",
    link: "https://renci.org/"
  },
  {
    name: "Anita Nikolich",
    org: "University of Illinois Urbana Champaign",
    link: "https://illinois.edu/"
  },
  {
    name: "Jim Griffioen",
    org: "University of Kentucky",
    link: "https://www.uky.edu/"
  },
  {
    name: "Kuang-Ching Wang",
    org: "Clemson University",
    link: "https://www.clemson.edu/"
  },
  {
    name: "Inder Monga",
    org: "Lawrence Berkeley National Laboratory",
    link: "https://www.lbl.gov/"
  },
  {
    name: "Rob Gardner",
    org: "University of Chicago",
    link: "https://www.uchicago.edu/"
  }
]
const AboutFABRIC = () => {
  return (
    <div className="container pb-5 static-page">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">About FABRIC</h1>
      <p>
      FABRIC (FABRIC is Adaptive ProgrammaBle Research Infrastructure for Computer Science and Science Applications) is an International infrastructure that enables cutting-edge experimentation and research at-scale in the areas of networking, cybersecurity, distributed computing, storage, virtual reality, 5G, machine learning, and science applications.
      </p>
      <p>The FABRIC infrastructure is a distributed set of equipment at commercial collocation spaces, national labs and campuses. Each of the 29 FABRIC sites has large amounts of compute and storage, interconnected by high speed, dedicated optical links. It also connects to specialized testbeds (5G/IoT PAWR, NSF Clouds), the Internet and high-performance computing facilities to create a rich environment for a wide variety of experimental activities.</p>
      <p>FABRIC Across Borders (FAB) extends the network to 4 additional nodes in Asia and Europe.</p>
      <p>
      <div className="d-flex align-items-center mb-4 alert alert-primary">
        <img
          src={nsfLogo}
          width="40"
          height="40"
          className="d-inline-block align-top me-3"
          alt=""
        />
          <div className="text-center text-md-size">
          FABRIC is funded by NSF grants {nsfAwardNumbers.map((number, index) => 
            <span><a href={`https://www.nsf.gov/awardsearch/showAward?AWD_ID=${number}&HistoricalAwards=false`} target="_blank" rel="noopener noreferrer">CNS-{number}</a>{index !== nsfAwardNumbers.length -1 && ", "}</span>)
          }.
          </div>
      </div>
      </p>
      <h2 className="my-4">FABRIC Capabilities</h2>
      <div className="row text-center">
        <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header bg-primary-light d-flex justify-content-center">
                <img
                  src={iconInternet}
                  key={`about-fabric-internet`}
                  className="align-self-center"
                  height="40"
                  alt="about-fabric-internet"
                />
              </div>
              <div className="card-body">
                <h3 className="my-3">FABRIC Enables New Internet and Science Applications</h3>
                <p className="text-center">Encourages a multidisciplinary approach to designing the next generation Internet supporting end users as well as science domains that depend on large-scale intelligent networks. Provides access to cutting-edge programmable network technologies, like P4 and OpenFlow. </p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header bg-primary-light d-flex justify-content-center">
                <img
                  src={iconSecurity}
                  key={`about-fabric-security`}
                  className="align-self-center"
                  height="40"
                  alt="about-fabric-security"
                />
              </div>
              <div className="card-body">
                <h3 className="my-3">FABRIC Advances Cybersecurity</h3>
                <p className="text-center">Enables at-scale, more realistic research by peering with production networks to observe behavior.</p>
              </div>
            </div>
          </div>
      </div>
      <div className="row mt-4 text-center">
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header bg-primary-light d-flex justify-content-center">
                <img
                  src={iconMachineLearning}
                  key={`about-fabric-machine-learning`}
                  className="align-self-center"
                  height="40"
                  alt="about-fabric-machine-learning"
                />
              </div>
              <div className="card-body">
                <h3 className="my-3">FABRIC Integrates Machine Learning & Artificial Intelligence</h3>
                <p className="text-center">Enables novel approaches to distributed and network systems control and management by integrating Machine Learning capabilities.</p>
              </div>
            </div>
          </div>
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header bg-primary-light d-flex justify-content-center">
                <img
                  src={iconIot}
                  key={`about-fabric-iot`}
                  className="align-self-center"
                  height="40"
                  alt="about-fabric-iot"
                />
              </div>
              <div className="card-body">
                <h3 className="my-3">FABRIC Integrates HPC, Wireless, and IoT</h3>
                <p className="text-center">Creates a diverse environment combining programmable core and edge networks, large computational resources, 5G and IoT capabilities.</p>
              </div>
            </div>
          </div>
      </div>
      <div className="row mt-4 text-center">
          <div className="col-sm-6">
            <div className="card contact-us-card">
              <div className="card-header bg-primary-light d-flex justify-content-center">
                <img
                  src={iconEducation}
                  key={`about-fabric-education`}
                  className="align-self-center"
                  height="40"
                  alt="about-fabric-education"
                />
              </div>
              <div className="card-body">
                <h3 className="my-3">FABRIC Promotes Education</h3>
                <p className="text-center">
                  FABRIC helps train the next generation of computer science researchers.
                </p>
              </div>
            </div>
          </div>
      </div>

      <h2 className="mt-4">What is FABRIC?</h2>
      <p>FABRIC helps train the next generation of computer science researchers.</p>
      <div className="row">
        <div className="col-sm-6">
          <h4 className="text-primary">Presentation</h4>
          <iframe title="Presentation: What is FABRIC?" src="https://drive.google.com/file/d/1Wa8kkuyycSBRNjUZIVYXFbSRHt2n4Vhy/preview" width="100%" height="315"></iframe>
        </div>
        <div className="col-sm-6">
          <h4 className="text-primary">Webinar</h4>
          <iframe title="Webinar: What is FABRIC?" width="100%" height="315" src="https://www.youtube.com/embed/ofLz_7rWTDg" frameBorder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </div>
      </div>
      <div className="d-flex justify-content-center">
        <a href={portalData.marketingWebsiteLinks.generalBrochure} target="_blank" rel="noopener noreferrer">
          <button className="btn btn-primary mt-5">Download FABRIC Brochure</button>
        </a>
      </div>
      <h1 className="mb-4">About FAB</h1>
      <p>FABRIC Across Borders (FAB) is an extension of the FABRIC testbed connecting the core North America infrastructure to four nodes in Asia, Europe, and South America. By creating the networks needed to move vast amounts of data across oceans and time zones seamlessly and securely, the project enables international collaboration to speed scientific discovery.</p>
      <h2 className="text-primary">Science Applications</h2>
      <p>FAB is driven by science needs in fields that are pushing the limits of what today’s Internet can support. It offers a testbed to explore ways to handle and share massive amounts of data generated by powerful new scientific instruments around the globe.</p>
      <p>FAB is built around use cases led by scientific partners in five areas:</p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>Smart Cities</th>
            <td>Sensing and Computing</td>
            <td>SAGE • University of Antwerp • University of Bristol</td>
          </tr>
          <tr>
            <th>Weather</th>
            <td>Weather and Climate Prediction</td>
            <td>University of Miami • CPTECH Center for Weather Forecast and Climatic Studies, Brazil</td>
          </tr>
          <tr>
            <th>Physics</th>
            <td>High Energy Physics</td>
            <td>Large Hadron Collider, CERN • University of Chicago</td>
          </tr>
          <tr>
            <th>Space</th>
            <td>Astronomy and cosmology</td>
            <td>Legacy Survey of Space and Time • Cosmic Microwave Background-Stage 4</td>
          </tr>
          <tr>
            <th>Computer Science</th>
            <td>Private 5G networks, censorship evasion, network competition and sharing, software-defined networking, P4 programming </td>
            <td>University of Tokyo • Clemson University • University of Kentucky • KREONET</td>
          </tr>
        </tbody>
      </table>
      <h2 className="text-primary my-4">International Connections</h2>
      <div className="d-flex justify-content-center mt-3 px-4">
        <img src={FABMap} alt={`FAB map`} className="w-100" />
      </div>
      <p>
        FAB will connect FABRIC to five global partners:
      </p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>University of Tokyo</th>
            <td>Japan</td>
          </tr>
          <tr>
            <th>CERN, the European Organization for Nuclear Research</th>
            <td>Switzerland</td>
          </tr>
          <tr>
            <th>University of Bristol</th>
            <td>U.K.</td>
          </tr>
          <tr>
            <th>University of Amsterdam</th>
            <td>The Netherlands</td>
          </tr>
          <tr>
            <th>CPTEC/INPE</th>
            <td>Brazil</td>
          </tr>
        </tbody>
      </table>
      <p>
        High-speed links will be provided by NSF’s International Research & Education Network Connections:
      </p>
      <table className="table table-striped table-sm table-bordered">
        <tbody>
          <tr>
            <th>TransPAC</th>
            <td>U.S. to Asia</td>
          </tr>
          <tr>
            <th>StarLight</th>
            <td>U.S. to Europe</td>
          </tr>
          <tr>
            <th>Networks for European, American, and African Research (NEAAR)</th>
            <td>U.S. to Europe and Africa</td>
          </tr>
          <tr>
            <th>AmLight-ExP </th>
            <td>U.S. to South America and Africa</td>
          </tr>
        </tbody>
      </table>
      <h2 className="my-4 text-primary">FAB Core Team</h2>
      <table className="table table-hover">
        <tbody>
          {
            teamMembers.map((member, index) => <tr key={`fab-core-member-${index}`}>
              <th>{member.name}</th>
              <td><a href={member.link} target="_blank" rel="noreferrer">{member.org}</a></td>
            </tr>
          )
          }
        </tbody>
      </table>
    </div>
  );
};

export default AboutFABRIC;
