import React from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SiteResourceTable from './SiteResourceTable';
import SingleComponent from './SingleComponent';
import Select from 'react-select';
import _ from "lodash";
import validator from  "../../utils/sliceValidator";
import { sitesNameMapping }  from "../../data/sites";
import { Link } from "react-router-dom";
import { default as portalData } from "../../services/portalData.json";
import checkPortalType from "../../utils/checkPortalType";


class SideNodes extends React.Component {
  state = {
    selectedSite: { status: "" },
    selectedSiteOption: {},
    nodeName: "",
    core: 2,
    ram: 6,
    disk: 10,
    nodeType: "VM",
    nodeComponents: [],
    imageType: "qcow2",
    selectedImageRef: "default_rocky_8",
    BootScript: "",
    bandwidth: 0,
    vlan: ""
  }

  osImageToAbbr = {
    "CentOS Stream 8": "default_centos8_stream",
    "CentOS Stream 9": "default_centos9_stream",
    "Debian 11": "default_debian_11",
    "Debian 12": "default_debian_12",
    "Fedora 39": "default_fedora_39",
    "Fedora 40": "default_fedora_40",
    "Freebsd 13": "default_freebsd_13_zfs",
    "Freebsd 14": "default_freebsd_14_zfs",
    "Kali": "default_kali",
    "Openbsd 7": "default_openbsd_7",
    "Rocky 8": "default_rocky_8",
    "Rocky 9": "default_rocky_9",
    "Ubuntu 20": "default_ubuntu_20",
    "Ubuntu 22": "default_ubuntu_22",
    "Ubuntu 24": "default_ubuntu_24",
    "Custom Rocky 8": "docker_rocky_8",
    "Custom Rocky 9": "docker_rocky_9",
    "Custom Ubuntu 20": "docker_ubuntu_20",
    "Custom Ubuntu 22": "docker_ubuntu_22",
    "BMv2 Ubuntu 20": "attestable_bmv2_v2_ubuntu_20"
  }

  facilityPortNames = {
    "alpha": ['RENC-Chameleon', 'RENC-GSU'],
    "beta": ['RENC-Chameleon', 'RENC-GSU', 'UKY-AL2S'],
    "production": [
    "Chameleon-StarLight",
    "Chameleon-TACC",
    "Cloud-Facility-AWS",
    "Cloud-Facility-Azure",
    "Cloud-Facility-Azure-Gov",
    "Cloud-Facility-GCP",
    "ESnet-StarLight",
    "Internet2-StarLight",
    "OCT-MGHPCC",
    "RCNF",
    "Utah-Cloudlab-Powder",
    "CLemson-Cloudlab"
  ]};

  facilityPortVlanRanges = {
    "Chameleon-StarLight": "3300-3309",
    "Chameleon-TACC": "3210-3499",
    "Cloud-Facility-AWS": "####-####",
    "Cloud-Facility-Azure": "####-####",
    "Cloud-Facility-Azure-Gov": "####-####",
    "Cloud-Facility-GCP": "####-####",
    "ESnet-StarLight": "3737-3739",
    "Internet2-StarLight": "3727-3729",
    "OCT-MGHPCC": "3110-3119",
    "RCNF": "3741-3751",
    "Utah-Cloudlab-Powder": "2100-3499",
    "CLemson-Cloudlab": "1000-2599",
    "RENC-GSU": "1000",
    "RENC-Chameleon": "2000-2001",
    "UKY-AL2S": "852-855"
  }

  siteFacilityPortPairing = {
    "STAR": ["Chameleon-StarLight", "ESnet-StarLight", "Internet2-StarLight"],
    "TACC": ["Chameleon-TACC"],
    "AWS": ["Cloud-Facility-AWS"],
    "Azure": ["Cloud-Facility-Azure"],
    "Azure-Gov": ["Cloud-Facility-Azure-Gov"],
    "GCP": ["Cloud-Facility-GCP"],
    // RCNF to WASH (temporary, until RUTG site is online)
    "WASH": ["RCNF"],
    "UTAH": ["Utah-Cloudlab-Powder"],
    "CLEM": ["CLemson-Cloudlab"],
    "RENC": ["RENC-GSU", "RENC-Chameleon"],
    "UKY": ["UKY-AL2S"],
    "MASS": ["OCT-MGHPCC"]
  }

  handleAddNode = () => {
    // support types: 'VM', 'Facility', 'P4 Switch'
    if (this.state.nodeType === "VM") {
      const { selectedSite, nodeName, core, ram, disk,
        imageType, selectedImageRef, nodeComponents, BootScript } = this.state;
      const image = `${selectedImageRef},${imageType}`;
      this.props.onVMAdd(selectedSite.name, nodeName, Number(core),
        Number(ram), Number(disk), image, nodeComponents, BootScript);
      this.setState({
        nodeName: "",
        core: 2,
        ram: 6,
        disk: 10,
        nodeType: "VM",
        nodeComponents: [],
        imageType: "qcow2",
        selectedImageRef: "default_rocky_8",
        BootScript: "",
      })
    } else if (this.state.nodeType === "Facility") {
      const { selectedSite, nodeName, bandwidth, vlan } = this.state;
      this.props.onFacilityAdd(selectedSite.name, nodeName, Number(bandwidth), vlan);
      this.setState({
        nodeName: "",
        bandwidth: 0,
        vlan: ""
      })
    } else if (this.state.nodeType === "Switch") {
      const { selectedSite, nodeName } = this.state;
      this.props.onSwitchAdd(selectedSite.name, nodeName);
      this.setState({ nodeName: "" })
    }
  }

  getFacilityPortNames = () => {
    const tags = this.props.projectTags;
    const fpNames = [];
    for (const tag of tags) {
      // if has Net.AllFacilityPorts tag, show all available FPs per the portal tier
      if (tag === "Net.AllFacilityPorts") {
        const portalType = checkPortalType(window.location.href);
        return this.facilityPortNames[portalType];
      }
      if (tag.includes("Net.FacilityPort")) {
        fpNames.push(tag.slice(17));
      }
    }

    return fpNames;
  }

  handleSliceComponentAdd = (component) => {
    const cloned_nodeComponents = _.clone(this.state.nodeComponents);
    cloned_nodeComponents.push(component);
    this.setState({ nodeComponents: cloned_nodeComponents});
  }

  handleSliceComponentDelete = (component) => {
    const updated_nodeComponents = [];
    for (const c of this.state.nodeComponents) {
      // component name should be unique within 1 node.
      if (c.name !== component.name) {
           updated_nodeComponents.push(c);
         }
    }

    this.setState({ nodeComponents: updated_nodeComponents });
  }

  getSiteResource = (name) => {
    for (const site of this.props.resources.parsedSites) {
      if (site.name === name) {
        return site;
      }
    }
  }

  generateSiteOptions = (sites) => {
    let options = [
      {
        value: "Random",
        label: "*Random*"
      }
    ];

    const sortedSiteOptions = [];
    for (const site of sites) {
      sortedSiteOptions.push({ 
        value: site.name,
        label: site.name
      })
    }

    sortedSiteOptions.sort((a, b) => a.value.localeCompare(b.value));

    options = options.concat(sortedSiteOptions);

    return options;
  }

  handleSiteChange = (e) => {
    if (e.value === "") {
      this.setState({ selectedSiteOption: {} });
    } else if (e.value === "Random") {
      const sites = this.props.resources.parsedSites;
      const random_site = sites[Math.floor(Math.random() * sites.length)];
      this.setState({
        selectedSiteOption: {
          value: random_site.name,
          label: random_site.name
        },
        selectedSite: this.getSiteResource(random_site.name)
      });
      
    } else {
      this.setState({
        selectedSiteOption: {
          value: e.value,
          label: e.value
        },
        selectedSite: this.getSiteResource(e.value)
      });
    }
  }

  handleNodeTypeChange = (e) => {
    this.setState({ nodeType: e.target.value, nodeName: "" });
  }

  handleNameChange = (e) => {
    this.setState({ nodeName: e.target.value });
  }

  handleCoreChange = (e) => {
    this.setState({ core: e.target.value });
  }

  handleRamChange = (e) => {
    this.setState({ ram: e.target.value });
  }

  handleDiskChange = (e) => {
    this.setState({ disk: e.target.value });
  }

  handleImageRefChange = (e) => {
    this.setState({ selectedImageRef: e.target.value });
  }

  handleBootScriptChange = (e) => {
    this.setState({ BootScript: e.target.value });
  }

  handleFPNameChange = (e) => {
    this.setState({ nodeName: e.target.value });
  }

  handleBandwidthChange = (e) => {
    this.setState({ bandwidth: e.target.value });
  }

  handleVlanChange = (e) => {
    this.setState({ vlan: e.target.value });
  }

  getResourcesSum = () => {
    const selectedLabels = [
      "freeCore",
      "freeDisk",
      "freeRAM",
      "freeGPU",
      "freeNVME",
      "freeSmartNIC",
      "freeSharedNIC",
   ]
 
   const sum = {
     id: 999,
     name: "FABRIC Testbed",
   };
 
   _.each(this.props.resources.parsedSites, (site) => {
     _.each(selectedLabels, (label) => sum[label] = (sum[label] || 0) + site[label]);
   });

   return sum;
  }

  render() {
    const { selectedSiteOption, selectedSite, nodeName, imageType, selectedImageRef, core, ram,
      disk, BootScript, nodeComponents, nodeType, bandwidth, vlan } = this.state;

    let validationResult = false;
    if (nodeType === "VM") {
      validationResult = selectedSiteOption &&
      validator.validateVMNodeComponents(selectedSiteOption.value, nodeName, this.props.nodes, core, ram, disk, nodeComponents, BootScript);
    } else if (nodeType === "Facility") {
      validationResult = selectedSiteOption &&
      validator.validateFPNode(selectedSiteOption.value, nodeName, bandwidth, vlan, this.facilityPortVlanRanges[nodeName])
    }

    const availableFPs = this.getFacilityPortNames();

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );
    return(
      <div>
        {this.props.resources !== null &&
          <div>
            {!_.isEmpty(selectedSiteOption) ?
              <div>
                <div className="mb-1">
                  <Link
                    to={`/sites/${selectedSiteOption.value}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                      {selectedSiteOption.value} { sitesNameMapping.acronymToLongName[selectedSiteOption.value] && 
                      `(${sitesNameMapping.acronymToLongName[selectedSiteOption.value]})`
                      }
                  </Link>
                  {
                    selectedSite.status.state === "Maint" && <span className="badge bg-danger px-2">
                      Maintenance
                    </span>
                  }
                  {
                    selectedSite.status.state === "PreMaint" && <span className="badge bg-warning px-2">
                      Pre-Maintenance
                    </span>
                  }
                  {
                    selectedSite.status.state === "PartMaint" && <span className="badge bg-warning px-2">
                      Partial Maintenance
                    </span>
                  }
                </div>
                <SiteResourceTable site={selectedSite} />
              </div> :
                 <div>
                 <div className="mb-1">
                   Available FABRIC Testbed Resources 
                 </div>
                 <SiteResourceTable site={this.getResourcesSum()} />
               </div>
            }
          <form>
            <div className="bg-light">
              <div className="form-row mx-1">
                <div className="form-group slice-builder-form-group col-md-3">
                  <label htmlFor="inputState" className="slice-builder-label">
                    Site
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 100, hide: 300 }}
                      overlay={renderTooltip("site-tooltip", portalData.helperText.sitesDescription)}
                    >
                      <i className="fa fa-question-circle text-secondary ms-2"></i>
                    </OverlayTrigger>
                  </label>
                  <Select
                    value={selectedSiteOption}
                    isSearchable={true}
                    onChange={this.handleSiteChange}
                    options={this.generateSiteOptions(this.props.resources.parsedSites)}
                  />
                </div>
                <div className="form-group slice-builder-form-group col-md-3">
                  <label htmlFor="NodeType" className="slice-builder-label">
                    Node Type
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 100, hide: 300 }}
                      overlay={renderTooltip("node-tooltip", portalData.helperText.nodeDescription)}
                    >
                      <i className="fa fa-question-circle text-secondary ms-2"></i>
                    </OverlayTrigger>
                  </label>
                  <select
                    className="form-control form-control-sm"
                    id="nodeTypeSelect"
                    disabled={availableFPs.length === 0}
                    onChange={this.handleNodeTypeChange}
                  >
                    <option value="VM">VM</option>
                    <option value="Facility">Facility Port</option>
                    {/* <option value="Switch">P4 Switch</option> */}
                  </select>
                </div>
                {
                  ["VM", "Switch"].includes(nodeType) && <div className="form-group slice-builder-form-group col-md-6">
                    <label htmlFor="inputNodeName" className="slice-builder-label">
                      Node Name
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip("site-tooltip", portalData.helperText.nodeNameDescription)}
                      >
                        <i className="fa fa-question-circle text-secondary ms-2"></i>
                      </OverlayTrigger>
                    </label>
                    <input
                      type="text"
                      className="form-control form-control-sm"
                      id="inputNodeName"
                      value={nodeName}
                      onChange={this.handleNameChange}
                      placeholder={"at least 2 characters..."}
                    />
                  </div>
                }
                {
                  nodeType === "Facility" && <div className="form-group slice-builder-form-group col-md-6">
                    <label htmlFor="selectNodeName" className="slice-builder-label">Node Name</label>
                    <select
                      className="form-control form-control-sm"
                      id="componentSelect"
                      value={nodeName}
                      onChange={this.handleFPNameChange}
                    >
                      <option value="">Choose...</option>
                      {
                         availableFPs.length > 0 && availableFPs.map((name, i) => {
                          return (
                            <option value={name} key={`fp-name-${i}`}>{name}</option>
                          )
                        })
                      }
                    </select>
                  </div>
                }
              </div>
              { 
                nodeType === "Facility" && nodeName &&
                <div className="form-row mx-1">
                  <div className="form-group slice-builder-form-group col-md-4">
                    <label htmlFor="inputCore" className="slice-builder-label">
                      Bandwidth
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip("node-tooltip", portalData.helperText.bandwidthDescription)}
                      >
                        <i className="fa fa-question-circle text-secondary ms-2"></i>
                      </OverlayTrigger>
                    </label>
                    <input type="number" className="form-control form-control-sm" id="inputBandwidth"
                      value={bandwidth} onChange={this.handleBandwidthChange}/>
                  </div>
                  <div className="form-group slice-builder-form-group col-md-8">
                    <label htmlFor="inputVlan" className="slice-builder-label">
                      VLAN (Range: {this.facilityPortVlanRanges[nodeName] })
                    </label>
                    <input type="text" className="form-control form-control-sm" id="inputVlan"
                      value={vlan} onChange={this.handleVlanChange}/>
                  </div>
                </div>
              }
              {
                nodeType === "VM" && 
                <div className="form-row mx-1">
                  <div className="form-group slice-builder-form-group col-md-2">
                    <label htmlFor="inputCore" className="slice-builder-label">Cores</label>
                    <input type="number" className="form-control form-control-sm" id="inputCore"
                      value={core} onChange={this.handleCoreChange}/>
                  </div>
                  <div className="form-group slice-builder-form-group col-md-2">
                    <label htmlFor="inputRam" className="slice-builder-label">RAM(GB)</label>
                    <input type="number" className="form-control form-control-sm" id="inputRam"
                      value={ram} onChange={this.handleRamChange}/>
                  </div>
                  <div className="form-group slice-builder-form-group col-md-2">
                    <label htmlFor="inputDisk" className="slice-builder-label">Disk(GB)</label>
                    <input type="number" className="form-control form-control-sm" id="inputDisk"
                      value={disk} onChange={this.handleDiskChange}/>
                  </div>
                  <div className="form-group slice-builder-form-group col-md-4">
                    <label htmlFor="inputState" className="slice-builder-label">
                      OS Image
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip("node-tooltip", portalData.helperText.customImagesDescription)}
                      >
                        <i className="fa fa-question-circle text-secondary ms-2"></i>
                      </OverlayTrigger>
                    </label>
                    <select
                      className="form-control form-control-sm"
                      value={selectedImageRef}
                      onChange={this.handleImageRefChange}
                    >
                      {
                        Object.entries(this.osImageToAbbr).map((keyValuePairArr) => 
                          <option
                            value={keyValuePairArr[1]}
                            key={`osImage-${keyValuePairArr[1]}`}
                          >
                            {keyValuePairArr[0]}
                          </option>
                        )
                      }
                    </select>
                  </div>
                  <div className="form-group slice-builder-form-group col-md-2">
                    <label htmlFor="inputState" className="slice-builder-label">Format</label>
                    <select className="form-control form-control-sm" disabled>
                      <option>{imageType}</option>
                    </select>
                  </div> 
                </div>
              }
              {!validationResult.isValid && validationResult.message !== "" &&
                <div className="my-2 mx-1 sm-alert">
                  {validationResult.message}
                </div>
              }
              {
                nodeType === "VM" && 
                <div className="form-row mx-1">
                  <div className="form-group slice-builder-form-group col-md-12">
                    <label for="BootScript" className="slice-builder-label">
                      Boot Script (optional)
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip("boot-script-tooltip", portalData.helperText.bootScriptDescription)}
                      >
                        <i className="fa fa-question-circle text-secondary ms-2"></i>
                      </OverlayTrigger>
                    </label>
                    <textarea
                      className="form-control"
                      id="BootScript"
                      rows="1"
                      value={BootScript}
                      onChange={this.handleBootScriptChange}
                    />
                  </div>
                </div>
              }
            </div>
            {
              nodeType === "VM" &&
              <div className="mt-2 bg-light">
                <SingleComponent
                  addedComponents={nodeComponents}
                  onSliceComponentAdd={this.handleSliceComponentAdd}
                />
                <div className="text-sm-size"><b>Added Components:</b></div>
                {
                  nodeComponents.length === 0 &&
                  <div className="my-2 mx-1 sm-alert">
                    No component added. Please click the <b>+</b> button to add a component.
                  </div>
                }
                {
                  nodeComponents.length > 0 && nodeComponents.map((component) => 
                    <SingleComponent
                      key={component.name}
                      component={component}
                      onSliceComponentDelete={this.handleSliceComponentDelete}
                    />
                  )
                }
              </div>
            }
          </form>
          <div className="my-2 d-flex flex-row">
            <button
              className="btn btn-sm btn-success mb-2"
              type="button"
              onClick={() => this.handleAddNode()}
              disabled={!(selectedSiteOption && selectedSiteOption.value) || nodeName === "" || !validationResult.isValid}
            >
              Add Node
            </button>
          </div>
        </div>
        }
      </div>
    )
  }
}

export default SideNodes;