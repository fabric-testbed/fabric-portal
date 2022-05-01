import React from 'react';
import SiteResourceTable from './SiteResourceTable';
import SingleComponent from './SingleComponent';
import _ from "lodash";

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

  imageRef = [
    "default_centos8_stream",
    "default_centos9_stream",
    "default_centos_7",
    "default_centos_8",
    "default_debian_10",
    "default_fedora_35",
    "default_rocky_8",
    "default_ubuntu_18",
    "default_ubuntu_20",
    "default_ubuntu_21",
    "default_ubuntu_22",
  ]

  handleAddNode = () => {
    // type: currently only support 'VM'
    const { selectedSite, nodeName, nodeType, core, ram, disk, imageType, imageRef, nodeComponents } = this.state;
    // concatenate image type and ref to be one string
    const image = `${imageRef},${imageType}`;
    this.props.onNodeAdd(nodeType, selectedSite, nodeName, core, ram, disk, image, nodeComponents);
    this.setState({ nodeName: "", nodeComponents: [] })
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
    if (e.target.value === "Choose...") {
      this.setState({ selectedSite: "" });
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
    this.setState({ imageRef: e.target.value })
  }

  getSiteResource = () => {
    for (const site of this.props.resources.parsedSites) {
      if (site.name === this.state.selectedSite) {
        return site;
      }
    }
  }

  render() {
    const { selectedSite, nodeName, imageType, selectedImageRef } = this.state;
    return(
      <div>
        {this.props.resources !== null &&
          <div>
            {
              selectedSite !== "" &&
              <div>
                <div className="mb-1">
                  Available Site Resources - <span className="font-weight-bold">{this.state.selectedSite}</span>
                </div>
                <SiteResourceTable site={this.getSiteResource()} />
              </div>
            }
          <form>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-3">
                <label htmlFor="inputState" className="slice-builder-label">Site</label>
                <select
                  className="form-control form-control-sm"
                  id="siteNameSelect"
                  onChange={this.handleSiteChange}
                  defaultValue={""}
                >
                  <option value="Choose...">Choose...</option>
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
                  onChange={this.handleNodeTypeChange}
                  defaultValue=""
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
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputCore" className="slice-builder-label">Core</label>
                <input type="number" className="form-control form-control-sm" id="inputCore"
                  defaultValue="2" onChange={this.handleCoreChange}/>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputRam" className="slice-builder-label">Ram</label>
                <input type="number" className="form-control form-control-sm" id="inputRam"
                  defaultValue="6" onChange={this.handleRamChange}/>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputDisk" className="slice-builder-label">Disk</label>
                <input type="number" className="form-control form-control-sm" id="inputDisk"
                  defaultValue="10" onChange={this.handleDiskChange}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputState" className="slice-builder-label">Image Type</label>
                <select className="form-control form-control-sm"disabled>
                  <option>{imageType}</option>
                </select>
              </div> 
              <div className="form-group slice-builder-form-group col-md-8">
                <label htmlFor="inputState" className="slice-builder-label">Image Ref</label>
                <select
                  className="form-control form-control-sm"
                  onChange={this.handleImageRefChange}
                  defaultValue={selectedImageRef}
                >
                  {
                    this.imageRef.map(ref => 
                      <option value={ref} key={ref}>{ref}</option>
                    )
                  }
                </select>
              </div>
            </div>
            <div className="mt-2 bg-light">
              <SingleComponent
                onSliceComponentAdd={this.handleSliceComponentAdd}
              />
              {
                this.state.nodeComponents.map((component) => 
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
            >
              Add Node with Components
            </button>
            </div>
        </div>
        }
      </div>
    )
  }
}

export default SideNodes;