import React, { useState } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import SiteResourceTable from './SiteResourceTable';
import SingleComponent from './SingleComponent';
import Select from 'react-select';
import _ from "lodash";
import validator from  "@/lib/slices/sliceValidator";
import { sitesNameMapping }  from "../../assets/data/sites";
import Link from "next/link";
import { default as portalData } from "../../services/portalData.json";
import { HelpCircle } from "lucide-react";

const osImageToAbbr = {
  "CentOS Stream 8": "default_centos8_stream",
  "CentOS Stream 9": "default_centos9_stream",
  "CentOS Stream 10": "default_centos10_stream",
  "Debian 11": "default_debian_11",
  "Debian 12": "default_debian_12",
  "Debian 13": "default_debian_13",
  "Fedora 39": "default_fedora_39",
  "Fedora 40": "default_fedora_40",
  "FreeBSD 13": "default_freebsd_13_zfs",
  "FreeBSD 14": "default_freebsd_14_zfs",
  "Kali": "default_kali",
  "OpenBSD 7": "default_openbsd_7",
  "Rocky 8": "default_rocky_8",
  "Rocky 9": "default_rocky_9",
  "Rocky 10": "default_rocky_10",
  "Ubuntu 20": "default_ubuntu_20",
  "Ubuntu 22": "default_ubuntu_22",
  "Ubuntu 24": "default_ubuntu_24",
  "Ubuntu 25": "default_ubuntu_25",
  "Custom Rocky 8": "docker_rocky_8",
  "Custom Rocky 9": "docker_rocky_9",
  "Custom Rocky 10": "docker_rocky_10",
  "Custom Ubuntu 20": "docker_ubuntu_20",
  "Custom Ubuntu 22": "docker_ubuntu_22",
  "Custom Ubuntu 24": "docker_ubuntu_24",
  "Custom Ubuntu 25": "docker_ubuntu_25",
  "DPU Ubuntu 24": "dpu_ubuntu_24",
  "BMv2 Ubuntu 20": "attestable_bmv2_ubuntu_20"
};


export default function SideNodes({ resources, nodes, projectTags, facilityPorts, onVMAdd, onFacilityAdd, onSwitchAdd }) {
  const [selectedSite, setSelectedSite] = useState({ status: "" });
  const [selectedSiteOption, setSelectedSiteOption] = useState({});
  const [nodeName, setNodeName] = useState("");
  const [core, setCore] = useState(2);
  const [ram, setRam] = useState(6);
  const [disk, setDisk] = useState(10);
  const [nodeType, setNodeType] = useState("VM");
  const [nodeComponents, setNodeComponents] = useState([]);
  const [imageType, setImageType] = useState("qcow2");
  const [selectedImageRef, setSelectedImageRef] = useState("default_rocky_8");
  const [BootScript, setBootScript] = useState("");
  const [bandwidth, setBandwidth] = useState(0);
  const [vlan, setVlan] = useState("");

  const handleAddNode = () => {
    if (nodeType === "VM") {
      const image = `${selectedImageRef},${imageType}`;
      onVMAdd(selectedSite.name, nodeName, Number(core),
        Number(ram), Number(disk), image, nodeComponents, BootScript);
      setNodeName("");
      setCore(2);
      setRam(6);
      setDisk(10);
      setNodeType("VM");
      setNodeComponents([]);
      setImageType("qcow2");
      setSelectedImageRef("default_rocky_8");
      setBootScript("");
    } else if (nodeType === "Facility") {
      onFacilityAdd(selectedSite.name, nodeName, Number(bandwidth), vlan);
      setNodeName("");
      setBandwidth(0);
      setVlan("");
    } else if (nodeType === "Switch") {
      onSwitchAdd(selectedSite.name, nodeName);
      setNodeName("");
    }
  }

  const getFacilityPortNames = () => {
    const fpNames = [];
    for (const tag of projectTags) {
      if (tag === "Net.AllFacilityPorts") {
        return (facilityPorts || []).map(fp => fp.name);
      }
      if (tag.includes("Net.FacilityPort")) {
        fpNames.push(tag.slice(17));
      }
    }
    return fpNames;
  }

  const getFacilityPortVlanRange = (name) => {
    const fp = (facilityPorts || []).find(fp => fp.name === name);
    return fp && fp.vlan_range && fp.vlan_range.length > 0 ? fp.vlan_range[0] : "";
  }

  const handleSliceComponentAdd = (component) => {
    const cloned_nodeComponents = _.clone(nodeComponents);
    cloned_nodeComponents.push(component);
    setNodeComponents(cloned_nodeComponents);
  }

  const handleSliceComponentDelete = (component) => {
    const updated_nodeComponents = [];
    for (const c of nodeComponents) {
      if (c.name !== component.name) {
           updated_nodeComponents.push(c);
         }
    }

    setNodeComponents(updated_nodeComponents);
  }

  const getSiteResource = (name) => {
    for (const site of resources.parsedSites) {
      if (site.name === name) {
        return site;
      }
    }
  }

  const generateSiteOptions = (sites) => {
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

  const handleSiteChange = (e) => {
    if (e.value === "") {
      setSelectedSiteOption({});
    } else if (e.value === "Random") {
      const sites = resources.parsedSites;
      const random_site = sites[Math.floor(Math.random() * sites.length)];
      setSelectedSiteOption({
        value: random_site.name,
        label: random_site.name
      });
      setSelectedSite(getSiteResource(random_site.name));
    } else {
      setSelectedSiteOption({
        value: e.value,
        label: e.value
      });
      setSelectedSite(getSiteResource(e.value));
    }
  }

  const handleNodeTypeChange = (e) => {
    setNodeType(e.target.value);
    setNodeName("");
  }

  const handleNameChange = (e) => {
    setNodeName(e.target.value);
  }

  const handleCoreChange = (e) => {
    setCore(e.target.value);
  }

  const handleRamChange = (e) => {
    setRam(e.target.value);
  }

  const handleDiskChange = (e) => {
    setDisk(e.target.value);
  }

  const handleImageRefChange = (e) => {
    setSelectedImageRef(e.target.value);
  }

  const handleBootScriptChange = (e) => {
    setBootScript(e.target.value);
  }

  const handleFPNameChange = (e) => {
    setNodeName(e.target.value);
  }

  const handleBandwidthChange = (e) => {
    setBandwidth(e.target.value);
  }

  const handleVlanChange = (e) => {
    setVlan(e.target.value);
  }

  const checkSwitchAccess = () => {
    let access = false;
    const tags = projectTags;
    for (const tag of tags) {
      if (tag === "Switch.P4") {
        access = true;
      }
    }

    return access && selectedSite && selectedSite.freeSwitch;
  }

  const getResourcesSum = () => {
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

   _.each(resources.parsedSites, (site) => {
     _.each(selectedLabels, (label) => sum[label] = (sum[label] || 0) + site[label]);
   });

   return sum;
  }

  let validationResult = false;
  if (nodeType === "VM") {
    validationResult = selectedSiteOption &&
    validator.validateVMNodeComponents(selectedSiteOption.value, nodeName, nodes, core, ram, disk, nodeComponents, BootScript);
  } else if (nodeType === "Facility") {
    validationResult = selectedSiteOption &&
    validator.validateFPNode(selectedSiteOption.value, nodeName, bandwidth, vlan, getFacilityPortVlanRange(nodeName))
  } else if (nodeType === "Switch") {
    validationResult = selectedSiteOption &&
    validator.validateSwitchNode(selectedSiteOption.value, nodeName, nodes);
  }

  const availableFPs = getFacilityPortNames();

  const siteFPs = selectedSiteOption?.value
    ? [...new Set(availableFPs.filter(name =>
        (facilityPorts || []).some(fp => fp.name === name && fp.site === selectedSiteOption.value)
      ))]
    : [...new Set(availableFPs)];

  const renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );
  return(
    <div>
      {resources !== null &&
        <div>
          {!_.isEmpty(selectedSiteOption) ?
            <div>
              <div className="mb-1">
                <Link
                  href={`/resources/sites/${selectedSiteOption.value}`}
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
               <SiteResourceTable site={getResourcesSum()} />
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
                    <HelpCircle className="mx-2 text-secondary" size={16} />
                  </OverlayTrigger>
                </label>
                <Select
                  value={selectedSiteOption}
                  isSearchable={true}
                  onChange={handleSiteChange}
                  options={generateSiteOptions(resources.parsedSites)}
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
                    <HelpCircle className="mx-2 text-secondary" size={16} />
                  </OverlayTrigger>
                </label>
                <select
                  className="form-control form-control-sm"
                  id="nodeTypeSelect"
                  onChange={handleNodeTypeChange}
                >
                  <option value="VM">VM</option>
                  {availableFPs.length > 0 && <option value="Facility">Facility Port</option>}
                  { checkSwitchAccess() && <option value="Switch">P4 Switch</option>}
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
                      <HelpCircle className="mx-2 text-secondary" size={16} />
                    </OverlayTrigger>
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="inputNodeName"
                    value={nodeName}
                    onChange={handleNameChange}
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
                    onChange={handleFPNameChange}
                    disabled={selectedSiteOption?.value && siteFPs.length === 0}
                  >
                    <option value="">Choose...</option>
                    {
                      siteFPs.map((name, i) => (
                        <option value={name} key={`fp-name-${i}`}>{name}</option>
                      ))
                    }
                  </select>
                  {selectedSiteOption?.value && siteFPs.length === 0 && (
                    <div className="my-2 sm-alert">
                      No facility ports are available at {selectedSiteOption.value} for this project.
                    </div>
                  )}
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
                      <HelpCircle className="mx-2 text-secondary" size={16} />
                    </OverlayTrigger>
                  </label>
                  <input type="number" className="form-control form-control-sm" id="inputBandwidth"
                    value={bandwidth} onChange={handleBandwidthChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-8">
                  <label htmlFor="inputVlan" className="slice-builder-label">
                    VLAN (Range: {getFacilityPortVlanRange(nodeName)})
                  </label>
                  <input type="text" className="form-control form-control-sm" id="inputVlan"
                    value={vlan} onChange={handleVlanChange}/>
                </div>
              </div>
            }
            {
              nodeType === "VM" &&
              <div className="form-row mx-1">
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputCore" className="slice-builder-label">Cores</label>
                  <input type="number" className="form-control form-control-sm" id="inputCore"
                    value={core} onChange={handleCoreChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputRam" className="slice-builder-label">RAM(GB)</label>
                  <input type="number" className="form-control form-control-sm" id="inputRam"
                    value={ram} onChange={handleRamChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputDisk" className="slice-builder-label">Disk(GB)</label>
                  <input type="number" className="form-control form-control-sm" id="inputDisk"
                    value={disk} onChange={handleDiskChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-4">
                  <label htmlFor="inputState" className="slice-builder-label">
                    OS Image
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 100, hide: 300 }}
                      overlay={renderTooltip("node-tooltip", portalData.helperText.customImagesDescription)}
                    >
                      <HelpCircle className="mx-2 text-secondary" size={16} />
                    </OverlayTrigger>
                  </label>
                  <select
                    className="form-control form-control-sm"
                    value={selectedImageRef}
                    onChange={handleImageRefChange}
                  >
                    {
                      Object.entries(osImageToAbbr).map((keyValuePairArr) =>
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
                      <HelpCircle className="mx-2 text-secondary" size={16} />
                    </OverlayTrigger>
                  </label>
                  <textarea
                    className="form-control"
                    id="BootScript"
                    rows="1"
                    value={BootScript}
                    onChange={handleBootScriptChange}
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
                onSliceComponentAdd={handleSliceComponentAdd}
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
                    onSliceComponentDelete={handleSliceComponentDelete}
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
            onClick={() => handleAddNode()}
            disabled={!(selectedSiteOption && selectedSiteOption.value) || nodeName === "" || !validationResult.isValid || (nodeType === "Facility" && siteFPs.length === 0)}
          >
            Add Node
          </button>
        </div>
      </div>
      }
    </div>
  )
}
