import React from "react";
import BackgroundImage from "../../imgs/network-bg.svg";

const Publications = () => {
  return (
    <div className="container static-page pb-5">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Cite FABRIC</h1>
      <h2 className="text-primary mb-4">
        <u>
          <a
            href="https://ieeexplore.ieee.org/document/8972790"
            target="_blank"
            rel="noopener noreferrer"
          >
            FABRIC: A National-Scale Programmable Experimental Network Infrastructure
          </a>
        </u>
      </h2>
      <p>
      Ilya Baldin, Anita Nikolich, James Griffioen, Indermohan Inder S. Monga, Kuang-Ching Wang, Tom Lehman, Paul Ruth <br></br>
      <div className="d-flex align-items-center">
        <u>
          <a
            href="https://ieeexplore.ieee.org/document/8972790"
            target="_blank"
            rel="noopener noreferrer"
          >
            DOI: 10.1109/MIC.2019.2958545
          </a>
        </u>
        <div className="modal fade" id="citeFABRICModal" tabindex="-1" role="dialog" aria-labelledby="citeFABRICModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content" id="citeFABRICModalContent">
              <div className="modal-header">
                <h5 className="modal-title" id="citeFABRICModalLabel">Cite FABRIC</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                ...
              </div>
            </div>
          </div>
        </div>
        <button className="btn btn-outline-primary ml-3" data-toggle="modal" data-target="#citeFABRICModal">
          Cite FABRIC
        </button>
      </div>
      </p>
      <p>
        <b>Abstract:</b><br></br>
        FABRIC is a unique national research infrastructure to enable cutting-edge and exploratory research at-scale in networking, cybersecurity, distributed computing and storage systems, machine learning, and science applications. It is an everywhere-programmable nationwide instrument comprised of novel extensible network elements equipped with large amounts of compute and storage, interconnected by high speed, dedicated optical links. It will connect a number of specialized testbeds for cloud research (NSF Cloud testbeds CloudLab and Chameleon), for research beyond 5G technologies (Platforms for Advanced Wireless Research or PAWR), as well as production high-performance computing facilities and science instruments to create a rich fabric for a wide variety of experimental activities.
      </p>
    </div>
  );
};

export default Publications;
