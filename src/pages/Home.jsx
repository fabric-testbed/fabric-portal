import React from "react";

import CardOfItems from "../components/common/CardOfItems";
import ReactModal from "../components/common/ReactModal";

import { selfEnrollRequest } from "../services/portalData.json";
import { getLatestUpdates } from "../services/fakeFacilityUpdate";
import sitesNameMapping from "../data/sites";

import { NavLink } from "react-router-dom";

import CookieConsent from "react-cookie-consent";

import Topomap from "../components/Resource/Topomap";
import DetailTable from "../components/Resource/DetailTable";

import { getResources } from "../services/resourcesService.js";
import { toast } from "react-toastify";

class Home extends React.Component {
  state = {
    user: {},
    isActiveUser: true,
    resources: [],
    activeDetailName: "StarLight",
    nameToAcronym: sitesNameMapping.nameToAcronym,
    ancronymToName: sitesNameMapping.ancronymToName,
    siteNames: [],
  }

  async componentDidMount() {
    try {
      const { data } = await getResources();
      this.setState({ resources: this.siteParser(data) });
    } catch (ex) {
      toast.error("Failed to load resource information. Please reload this page.");
    }
  }

  siteParser = (data) => {
    let abqm_elements = JSON.parse(data.value.bqm);
    const nodes = abqm_elements.nodes;
    const parsedSites = [];
    const siteNames = [];
    /************ retrieve site data from all nodes. ************/
    nodes.forEach(node => {
      if (node.Class === "CompositeNode") {
        const site = {};
        site.id = node.id;
        site.nodeId = node.NodeID;
        site.name = node.Name;
        // total capacities:
        site.capacities = node.Capacities ? JSON.parse(node.Capacities) : {};
        site.totalCPU = site.capacities.cpu ? site.capacities.cpu : 0;
        site.totalCore = site.capacities.core ? site.capacities.core : 0;
        site.totalDisk = site.capacities.disk ? site.capacities.disk : 0;
        site.totalRAM = site.capacities.ram ? site.capacities.ram : 0;
        site.totalUnit = site.capacities.unit ? site.capacities.unit : 0;
        // allocated capacities:
        site.allocatedCapacities = node.CapacityAllocations ? JSON.parse(node.CapacityAllocations) : {};
        site.allocatedCPU = site.allocatedCapacities.cpu ? site.allocatedCapacities.cpu : 0;
        site.allocatedCore = site.allocatedCapacities.core ? site.allocatedCapacities.core : 0;
        site.allocatedDisk = site.allocatedCapacities.disk ? site.allocatedCapacities.disk : 0;
        site.allocatedRAM = site.allocatedCapacities.ram ? site.allocatedCapacities.ram : 0;
        site.allocatedUnit = site.allocatedCapacities.unit ? site.allocatedCapacities.unit : 0;
        // free capacities
        site.freeCPU = site.totalCPU - site.allocatedCPU;
        site.freeCore = site.totalCore - site.allocatedCore;
        site.freeDisk = site.totalDisk - site.allocatedDisk;
        site.freeRAM = site.totalRAM - site.allocatedRAM;
        site.freeUnit = site.totalUnit - site.allocatedUnit;

        parsedSites.push(site);
        siteNames.push(this.state.ancronymToName[site.name]);
      }
    })

    this.setState({ siteNames: siteNames });
    return parsedSites;
  }

  getResourceByName = (resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  }

  handleActiveDetailChange = (name) => {
    this.setState({ activeDetailName: name });
  }

  render() {
    return (
      <div className="home-container">
        {
          (localStorage.getItem("userStatus") === "inactive") &&
          <div className="self-enroll-container">
            <ReactModal
              id={selfEnrollRequest.id}
              title={selfEnrollRequest.title}
              link={selfEnrollRequest.link}
              content={selfEnrollRequest.content}
            />
          </div>
        }
        <div className="home-upper">
          <div className="home-upper-text">
            <h1>FABRIC Portal</h1>
            <p>FABRIC portal is your guide, helping make your experiment a success.</p>
            <ul>
              <li>Build Community: Inspire others with your research, discover collaborators, and find opportunities to showcase your project.</li>
              <li>Conduct Experiments: Take advantage of FABRIC resources to design, deploy, execute, and monitor your experiments.</li>
              <li>Browse the Library: Learn more about FABRIC through publications and user documentation. Discover additional complimentary facilities and testbeds to expand your research.</li>
            </ul>
            <a
              href="https://fabric-testbed.net/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <button className="btn btn-warning">Learn More</button>
            </a>
          </div>
        </div>
        <div className="home-lower row">
          <div className="col-xl-9 col-lg-12">
            <div className="card homepage-card mb-4">
              <div className="card-header text-center">
                <b>Resources</b>
              </div>
              <div className="card-body">
                <div className="row my-2">
                  <div className="col-xl-9 col-lg-8 col-sm-12 mb-4">
                    <Topomap onChange={this.handleActiveDetailChange} sites={this.state.siteNames} />
                  </div>
                  <div className="col-xl-3 col-lg-4 col-sm-12">
                    <DetailTable
                      name={this.state.activeDetailName}
                      resource={this.getResourceByName(this.state.resources, this.state.nameToAcronym[this.state.activeDetailName])}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-xl-3 col-lg-12">
            <CardOfItems header={"Facility Updates"} data={getLatestUpdates(2)} />
          </div>
        </div>
        <CookieConsent
          location="bottom"
          buttonText="OK"
          cookieName="cookieConsent"
          onAccept={() => {
            localStorage.setItem("cookieConsent", true)
          }}
        >
          <span className="text-lg">This Website Uses Cookies.</span>
          <div className="mt-1 text-sm">
            We require to use cookies to provide you access to FABRIC testbed resources and to personalize the content of this site. We do not share your personal information with anyone, other than providing anonymous aggregate facility usage statistics to our funders.
            Please accept our Cookie Policy by clicking ‘OK’. For more details, visit the <NavLink className="text-primary-light" to="/cookie-policy"><b>Cookie Policy Page</b></NavLink>.
          </div>
        </CookieConsent>
      </div>
    );
  }
}

export default Home;
