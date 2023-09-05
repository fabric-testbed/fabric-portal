import React, { useMemo, useState } from 'react';
import ChameleonCloud from "../../imgs/testbeds/chameleon-cloud.png";
import Cloudlab from "../../imgs/testbeds/cloudlab.png";
import Cosmos from "../../imgs/testbeds/cosmos.png";
import POWDER from "../../imgs/testbeds/powder.png";
import AERPAW from "../../imgs/testbeds/aerpaw.png";
import ARA from "../../imgs/testbeds/ara.png";
import MERGE from "../../imgs/testbeds/merge-tb.png";
import PEERING from "../../imgs/testbeds/peering.png";
import BristolIsOpen from "../../imgs/testbeds/bristol-is-open.png";
import Bridges from "../../imgs/testbeds/bridges.png";
import FAB from "../../imgs/testbeds/fab.png";
import Colosseum from "../../imgs/testbeds/colosseum.png";

const testbeds = [
  {
    "name": "Chameleon Cloud",
    "url": "https://chameleoncloud.org/",
    "image": ChameleonCloud,
    "description": "Chameleon is a large-scale, deeply reconfigurable experimental platform built to support Computer Sciences systems research."
  },
  {
    "name": "CloudLab",
    "url": "https://www.cloudlab.us/",
    "image": Cloudlab,
    "description": "Flexible, scientific infrastructure for research on the future of cloud computing. Researchers use CloudLab to build their own clouds, experimenting with new architectures that will form the basis for the next generation of computing platforms."
  },
  {
    "name": "Cosmos",
    "url": "https://powderwireless.net/",
    "image": Cosmos,
    "description": "The COSMOS project is aimed at design, development, and deployment of a city-scale advanced wireless testbed in order to support real-world experimentation on next-generation wireless technologies and applications."
  },
  {
    "name": "POWDER",
    "url": "https://powderwireless.net/",
    "image": POWDER,
    "description": 'Powder (the Platform for Open Wireless Data-driven Experimental Research) is a facility for experimenting on the future of wireless networking in a city-scale “living laboratory.”'
  },
  {
    "name": "AERPAW",
    "url": "https://aerpaw.org/",
    "image": AERPAW,
    "description": "AREPAW (Aerial Experimentation and Research Platform for Advanced Wireless) aim is to develop an advanced wireless research platform."
  },
  {
    "name": "ARA",
    "url": "https://arawireless.org/",
    "image": ARA,
    "description": "ARA is a wireless living lab for smart and connected rural communities that complements the technical specialties of earlier PAWR platforms, adding a focus on technologies for low-cost, high-speed rural broadband connectivity."
  },
  {
    "name": "MERGE",
    "url": "https://www.mergetb.org/",
    "image": MERGE,
    "description": "MergeTB is a large distributed system with a number of moving parts. The primary components in a Merge deployment are the Merge portal and a collection of testbed facilities. The portal provides user accounts, projects, shared storage, experiment control, access to running experiments, a web interface, and other user facing services. Testbed facilities provide the resources that underpin experiments."
  },
  {
    "name": "PEERING",
    "url": "https://peering.ee.columbia.edu/",
    "image": PEERING,
    "description": "PEERING is a system that provides safe and easy access for researchers and educators to the Internet's BGP routing system, enabling and inspiring transformational research."
  },
  {
    "name": "Bristol is Open",
    "url": "https://www.bristol.gov.uk/policies-plans-strategies/bristol-is-open",
    "image":  BristolIsOpen,
    "description": "Bristol is Open (BiO), was set up as a joint venture between Bristol City Council and the University of Bristol, to develop a ‘test-bed’ programmable, digital infrastructure."
  },
  {
    "name": "Bridges",
    "url": "https://cnl.gmu.edu/bridges/",
    "image": Bridges,
    "description": "Binding Research Infrastructures for the Deployment of Global Experimental Science, BRIDGES goal is to make customized deterministic cyber-infrastructure resources available to advanced experimental applications globally."
  },
  {
    "name": "COSMIC",
    "url": null,
    "image": null,
    "description": "COSMIC enables the use of unique programmable wireless, optical, and edge-cloud network testbed infrastructure for international collaborative experiments. It builds on the interfaces of the PAWR COSMOS (NYC) and ORBIT (NJ) testbeds with the PEERING (US/International) and FABRIC (US) testbeds, and adds connections to international testbeds, including CPQD (Brazil), Kyutech/StarBED (Japan), OneLab/NITOS (EU/Greece), and CONNECT (Ireland)."
  },
  {
    "name": "FAB",
    "url": "https://portal.fabric-testbed.net/about-fab",
    "image": FAB,
    "description": "FABRIC Across Borders (FAB) is an extension of the FABRIC testbed connecting the core North America infrastructure to four nodes in Asia, Europe, and South America. By creating the networks needed to move vast amounts of data across oceans and time zones seamlessly and securely, the project enables international collaboration to speed scientific discovery."
  },
  {
    "name": "Colosseum",
    "url": "http://colosseum.net",
    "image": Colosseum,
    "description": "Colosseum is owned and operated by the Institute for the Wireless Internet of Things (WIoT) at Northeastern University. It is a PAWR affiliated testbed supported by NSF. Colosseum provides the fidelity of hardware channel emulators, the flexibility of cloud-based emulators, and the scale of network simulators. It can emulate wireless applications and signals (with granularity at the RF signal level) traversing space and reflecting off multiple objects and obstacles as they travel from transmitters to receivers. With over 65,000+ channels emulated at the same time, Colosseum can create virtual worlds modeling radios operating in open fields, downtown, shopping mall, or a desert, by generating more than 52 terabytes of data per second."
  }
]
 
const Testbeds = () => {
  const allTestbeds = testbeds;
  const [query, setQuery] = useState('')

  const filteredTestbeds = useMemo(() => {
    const reducedQuery = query.toLowerCase().trim()
    const newTestbedList = testbeds.sort((t, u) => t.name.toLowerCase() < u.name.toLowerCase() ? -1 : 1)
    if (!reducedQuery) {
      return newTestbedList
    }
    return newTestbedList
      .filter(testbed => (
        testbed.name.toLowerCase().includes(reducedQuery) || testbed.description.toLowerCase().includes(reducedQuery))
      )
  }, [query, allTestbeds])

  const handleChangeQuery = event => setQuery(event.target.value)

  return (
    <div className="container pb-5 static-page">
      <h1 className="mb-4">Participating Testbeds and Facilities</h1>
      <p>
        FABRIC is a testbed of testbeds, helping users experiment using multiple testbeds. Like Lego blocks, users can get accounts on several testbeds and build an experiment using all of them.
      </p>
      <p>
        Additionally, testbeds can be powered by FABRIC. FABRIC can support testbeds as an underlying infrastructure, while not necessarily exposing the FABRIC interfaces to their users. Find a list of participating testbeds and facilities below.
      </p>
      <p>
        Want your testbed or facility listed? Add it <a href="https://share.hsforms.com/13ryeyx2VRjyaY9Q8kB9Wgg3ry9k" target="_blank" rel="noreferrer">here</a>.
        Need to update the information for your testbed? Update it <a href="https://share.hsforms.com/1ITfbhOzyQqysDzXoEiodUg3ry9k" target="_blank" rel="noreferrer">here</a>.
      </p>
      <p>
        The page is community sourced. FABRIC is not responsible for its user-generated content.
      </p>
      <div className="row px-5">
        <input
          className="col-12 border border-primary-light p-2"
          type="search"
          placeholder="Search Testbeds and Facilities..."
          aria-label="Search"
          value={ query }
          onChange={ handleChangeQuery }
        />
      </div>
      <div className="row mt-5">
        {
          filteredTestbeds.map((testbed, index) => 
          <div className="testbed-wrapper col-xs-12 col-sm-12 col-md-6 col-lg-4" key={`testbed-${index}`}>
            <div className="testbed-header">
              <img src={testbed.image} alt={`${testbed.name}`} className="testbed-logo"/>
            </div>
            <div className="testbed-description">
              <p>{ testbed.description }</p>
            </div>
            <div className="testbed-footer">
              {
                testbed.url && (
                  <a href={ testbed.url } target="_blank" rel="noopener noreferrer" className="testbed-link" aria-label={ `Visit the ${ testbed.name } website` }>
                    <i className="fa fa-link"></i>
                  </a>
                )
              }
            </div>
          </div>)
        }
      </div>
    </div>
  );
};

export default Testbeds;
