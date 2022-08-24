import React from 'react';
import SiteResourceTable from './SiteResourceTable';
import SingleComponent from './SingleComponent';
import _ from "lodash";
import validator from  "../../utils/sliceValidator";
import { sitesNameMapping }  from "../../data/sites";

class SideNodes extends React.Component {
  state = {
    selectedSite: "",
    nodeName: "",
    core: 2,
    ram: 6,
    disk: 10,
    nodeType: "VM",
    nodeComponents: [],
    imageType: "qcow2",
    selectedImageRef: "default_rocky_8",
  }

  osImageToAbbr = {
    "CentOS Stream 8": "default_centos8_stream",
    "CentOS Stream 9": "default_centos9_stream",
    "CentOS 7": "default_centos_7",
    "CentOS 8": "default_centos_8",
    "Debian 10": "default_debian_10",
    "Fedora 35": "default_fedora_35",
    "Rocky Linux 8": "default_rocky_8",
    "Ubuntu 18": "default_ubuntu_18",
    "Ubuntu 20": "default_ubuntu_20",
    "Ubuntu 21": "default_ubuntu_21",
    "Ubuntu 22": "default_ubuntu_22",
  }

  handleAddNode = () => {
    // type: currently only support 'VM'
    const { selectedSite, nodeName, nodeType, core, ram, disk, imageType, selectedImageRef, nodeComponents } = this.state;
    const image = `${selectedImageRef},${imageType}`;
    this.props.onNodeAdd(nodeType, selectedSite, nodeName, Number(core), Number(ram), Number(disk), image, nodeComponents);
    this.setState({
      selectedSite: "",
      nodeName: "",
      core: 2,
      ram: 6,
      disk: 10,
      nodeType: "VM",
      nodeComponents: [],
      imageType: "qcow2",
      selectedImageRef: "default_rocky_8",
    })
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

  handleSiteChange = (e) => {
    if (e.target.value === "") {
      this.setState({ selectedSite: ""});
    } else if (e.target.value === "Random") {
      const sites = this.props.resources.parsedSites;
      const random_site = sites[Math.floor(Math.random() * sites.length)].name;
      this.setState({selectedSite: random_site});
    } else {
      this.setState({ selectedSite: e.target.value });
    }
  }

  handleNodeTypeChange = (e) => {
    this.setState({ nodeType: e.target.value });
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
    this.setState({ selectedImageRef: e.target.value })
  }

  getSiteResource = () => {
    for (const site of this.props.resources.parsedSites) {
      if (site.name === this.state.selectedSite) {
        return site;
      }
    }
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
    const { selectedSite, nodeName, imageType, selectedImageRef, core, ram, disk, nodeComponents } = this.state;
    const validationResult = validator.validateNodeComponents(selectedSite, nodeName, this.props.nodes, core, ram, disk, nodeComponents);

    return(
      <div>
        {this.props.resources !== null &&
          <div>
            {
              selectedSite !== "" &&
              <div>
                <div className="mb-1">
                  Available Site Resources -
                  <span className="ml-1 font-weight-bold">
                    {this.state.selectedSite} ({sitesNameMapping.acronymToLongName[this.state.selectedSite]})
                  </span>
                </div>
                <SiteResourceTable site={this.getSiteResource()} />
              </div>
            }
            {
              selectedSite === "" &&
              <div>
                <div className="mb-1">
                  Available FABRIC Testbed Resources 
                </div>
                <SiteResourceTable site={this.getResourcesSum()} />
              </div>
            }
          <form>
            <div className="bg-light">
              <div className="form-row">
                <div className="form-group slice-builder-form-group col-md-3">
                  <label htmlFor="inputState" className="slice-builder-label">Site</label>
                  <select
                    className="form-control form-control-sm"
                    id="siteNameSelect"
                    value={selectedSite}
                    onChange={this.handleSiteChange}
                  >
                    <option value="">Choose...</option>
                    <option value="Random">Random</option>
                    {
                      this.props.resources.parsedSites.map(site => 
                        <option value={site.name} key={`site${site.id}`}>{site.name}</option>
                      )
                    }
                  </select>
                </div>
                <div className="form-group slice-builder-form-group col-md-3">
                  <label htmlFor="NodeType" className="slice-builder-label">Node Type</label>
                  <select
                    className="form-control form-control-sm"
                    id="nodeTypeSelect"
                    disabled
                    onChange={this.handleNodeTypeChange}
                  >
                    <option value="VM">VM</option>
                    {/* <option value="Server">Server</option> */}
                  </select>
                </div>
                <div className="form-group slice-builder-form-group col-md-6">
                  <label htmlFor="inputNodeName" className="slice-builder-label">Node Name</label>
                  <input
                    type="text"
                    className="form-control form-control-sm"
                    id="inputNodeName"
                    value={nodeName}
                    onChange={this.handleNameChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputCore" className="slice-builder-label">Cores</label>
                  <input type="number" className="form-control form-control-sm" id="inputCore"
                    value={core} onChange={this.handleCoreChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputRam" className="slice-builder-label">Ram(GB)</label>
                  <input type="number" className="form-control form-control-sm" id="inputRam"
                    value={ram} onChange={this.handleRamChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-2">
                  <label htmlFor="inputDisk" className="slice-builder-label">Disk(GB)</label>
                  <input type="number" className="form-control form-control-sm" id="inputDisk"
                    value={disk} onChange={this.handleDiskChange}/>
                </div>
                <div className="form-group slice-builder-form-group col-md-4">
                  <label htmlFor="inputState" className="slice-builder-label">OS Image</label>
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
              {!validationResult.isValid && validationResult.message !== "" &&
                <div className="my-2 sm-alert">
                  {validationResult.message}
                </div>
              }
            </div>
            <div className="mt-2 bg-light node-components-panel">
              <SingleComponent
                addedComponents={nodeComponents}
                onSliceComponentAdd={this.handleSliceComponentAdd}
              />
              <div className="text-sm-size"><b>Added Components:</b></div>
              {
                nodeComponents.length === 0 &&
                <div className="my-2 sm-alert">
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
          </form>
          <div className="my-2 d-flex flex-row">
            <button
              className="btn btn-sm btn-success mb-2"
              type="button"
              onClick={() => this.handleAddNode()}
              disabled={!validationResult.isValid}
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