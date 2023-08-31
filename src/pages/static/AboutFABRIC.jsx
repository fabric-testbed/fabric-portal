import React from "react";
import iconEducation from "../../imgs/capabilities/education.png";
import iconInternet from "../../imgs/capabilities/internet.png";
import iconIot from "../../imgs/capabilities/iot.png";
import iconMachineLearning from "../../imgs/capabilities/machine-learning.png";
import iconSecurity from "../../imgs/capabilities/security.png";
import { default as portalData } from "../../services/portalData.json";

const AboutFABRIC = () => {
  return (
    <div className="container pb-5 static-page">
      <h1 className="mb-4">About FABRIC</h1>
      <p>
      FABRIC (FABRIC is Adaptive ProgrammaBle Research Infrastructure for Computer Science and Science Applications) is an International infrastructure that enables cutting-edge experimentation and research at-scale in the areas of networking, cybersecurity, distributed computing, storage, virtual reality, 5G, machine learning, and science applications.
      </p>
      <p>The FABRIC infrastructure is a distributed set of equipment at commercial collocation spaces, national labs and campuses. Each of the 29 FABRIC sites has large amounts of compute and storage, interconnected by high speed, dedicated optical links. It also connects to specialized testbeds (5G/IoT PAWR, NSF Clouds), the Internet and high-performance computing facilities to create a rich environment for a wide variety of experimental activities.</p>
      <p>FABRIC Across Borders (FAB) extends the network to 4 additional nodes in Asia and Europe.</p>
      
      <h2 className="my-4">FABRIC Capabilities</h2>
      <div className="row text-center">
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
                <p className="text-center">Enables novel approaches to distributed and network systems control and management by integrating Machine Learning capabilities.</p>
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
    </div>
  );
};

export default AboutFABRIC;
