"use client";
import React from "react";
import CopyButton from "../../../components/common/CopyButton";

const Publications = () => {
  return (
    <div className="container static-page pb-5">
      <img src="/imgs/network-bg.svg" alt={`static page background`} className="static-page-bg"/>
      <h1 className="mb-4">Cite FABRIC</h1>
      <p>
        When publishing a paper that utilized FABRIC to obtain the results please cite the following paper:
      </p>
      <div className="cite-fabric-copy">
        {
          `
          Baldin, Ilya, Anita Nikolich, James Griffioen, Indermohan Inder S. Monga, Kuang-Ching Wang, Tom Lehman, and Paul Ruth. “FABRIC: A national-scale programmable experimental network infrastructure.” IEEE Internet Computing 23, no. 6 (2019): 38-47.
          `
        }
        <CopyButton
          id={
            `Baldin, Ilya, Anita Nikolich, James Griffioen, Indermohan Inder S. Monga, Kuang-Ching Wang, Tom Lehman, and Paul Ruth. “FABRIC: A national-scale programmable experimental network infrastructure.” IEEE Internet Computing 23, no. 6 (2019): 38-47.`
          }
          btnStyle={"btn btn-sm btn-secondary ms-2 py-0 px-1"}
          showCopiedValue={false}
          text=""
        />
      </div>
      <p>or using <b>BibTeX</b> below:</p>
      <div className="cite-fabric-copy">
        {
          `
            @article{fabric-2019,
              title={{FABRIC: A national-scale programmable experimental network infrastructure}},
              author={Baldin, Ilya and Nikolich, Anita and Griffioen, James and Monga, Indermohan Inder S and Wang, Kuang-Ching and Lehman, Tom and Ruth, Paul},
              journal={IEEE Internet Computing},
              volume={23},
              number={6},
              pages={38--47},
              publisher={IEEE}
            }
          `
        }
        <CopyButton
          id={
            `
            @article{fabric-2019,
              title={{FABRIC: A national-scale programmable experimental network infrastructure}},
              author={Baldin, Ilya and Nikolich, Anita and Griffioen, James and Monga, Indermohan Inder S and Wang, Kuang-Ching and Lehman, Tom and Ruth, Paul},
              journal={IEEE Internet Computing},
              volume={23},
              number={6},
              pages={38--47},
              publisher={IEEE}
            }`
          }
          btnStyle={"btn btn-sm btn-secondary ms-2 py-0 px-1"}
          showCopiedValue={false}
          text=""
        />
      </div>
      <p>This helps us track publications related to FABRIC especially when it comes to justifying continuing support for FABRIC to the funding agencies.</p>
      <h2 className="mt-5 mb-4">Publication</h2>
      <h3 className="text-primary mb-4">
        <u>
          <a
            href="https://ieeexplore.ieee.org/document/8972790"
            target="_blank"
            rel="noopener noreferrer"
          >
            FABRIC: A National-Scale Programmable Experimental Network Infrastructure
          </a>
        </u>
      </h3>
      <p>
      Ilya Baldin, Anita Nikolich, James Griffioen, Indermohan Inder S. Monga, Kuang-Ching Wang, Tom Lehman, Paul Ruth <br></br>
      </p>
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
      </div>
      <p>
        <b>Abstract:</b><br></br>
        FABRIC is a unique national research infrastructure to enable cutting-edge and exploratory research at-scale in networking, cybersecurity, distributed computing and storage systems, machine learning, and science applications. It is an everywhere-programmable nationwide instrument comprised of novel extensible network elements equipped with large amounts of compute and storage, interconnected by high speed, dedicated optical links. It will connect a number of specialized testbeds for cloud research (NSF Cloud testbeds CloudLab and Chameleon), for research beyond 5G technologies (Platforms for Advanced Wireless Research or PAWR), as well as production high-performance computing facilities and science instruments to create a rich fabric for a wide variety of experimental activities.
      </p>
    </div>
  );
};

export default Publications;
