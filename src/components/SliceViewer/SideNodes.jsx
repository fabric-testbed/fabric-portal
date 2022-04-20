import React from 'react';
import Switch from "../../imgs/SliceComponentIcons/Switch.png";
import VM from "../../imgs/SliceComponentIcons/VM.png";
import SiteResourceTable from './SiteResourceTable';

class SideNodes extends React.Component {
  state = {
    images: [
      {
        id: 1,
        name: "VM",
        component: VM,
      },
      {
        id: 2,
        name: "Switch",
        component: Switch,
      },
    ],
    selectedSite: "",
    nodeName: "",
    core: 0,
    ram: 0,
    disk: 0,
    componentType: "",
    componentName: "",
  }
  
  handleAddNode = (type) => {
    // type: "VM" or "switch"
    const { selectedSite, nodeName, core, ram, disk, componentType, componentName } = this.state;
    this.props.onNodeAdd(type, selectedSite, nodeName, core, ram, disk, componentType, componentName);
  }

  handleSiteChange = (e) => {
    this.setState({ selectedSite: e.target.value });
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

  handleComponentTypeChange = (e) => {
    this.setState({ componentType: e.target.value });
  }

  handleComponentNameChange = (e) => {
    this.setState({ componentName: e.target.value });
  }

  getSiteResource = () => {
    for (const site of this.props.resources.parsedSites) {
      if (site.name === this.state.selectedSite) {
        console.log(site)
        return site;
      }
    }
  }

  render() {
    console.log(this.props.resources)
    return(
      <div>
        {this.props.resources !== null &&
          <div>
            {
              this.state.selectedSite !== "" &&
              <div>
                <div className="mb-1">
                  Available Site Resources - <span className="font-weight-bold">{this.state.selectedSite}</span>
                </div>
                <SiteResourceTable site={this.getSiteResource()} />
              </div>
            }
          <form>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputState">Site</label>
                <select
                  className="form-control"
                  id="siteNameSelect"
                  onChange={this.handleSiteChange}
                  defaultValue=""
                >
                  <option>Choose...</option>
                  {
                    this.props.resources.parsedSites.map(site => 
                      <option value={site.name} key={`site${site.id}`}>{site.name}</option>
                    )
                  }
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputNodeName">Node Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputNodeName"
                  placeholder=""
                  onChange={this.handleNameChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-4">
                <label htmlFor="inputCore">Core</label>
                <input type="number" className="form-control" id="inputCore" onChange={this.handleCoreChange}/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputRam">Ram</label>
                <input type="number" className="form-control" id="inputRam" onChange={this.handleRamChange}/>
              </div>
              <div className="form-group col-md-4">
                <label htmlFor="inputDisk">Disk</label>
                <input type="number" className="form-control" id="inputDisk" onChange={this.handleDiskChange}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group col-md-6">
                <label htmlFor="inputComponent">Add Component</label>
                <select
                  className="form-control"
                  id="componentSelect"
                  onChange={this.handleComponentTypeChange}
                  defaultValue=""
                >
                  <option>Choose...</option>
                  <option value="GPU">GPU</option>
                  <option value="SmartNIC">SmartNIC</option>
                  <option value="SharedNIC">SharedNIC</option>
                  <option value="NVME">NVME</option>
                </select>
              </div>
              <div className="form-group col-md-6">
                <label htmlFor="inputComponentName">Component Name</label>
                <input
                  type="text" className="form-control" id="inputComponentName"
                  onChange={this.handleComponentNameChange}
                />
              </div>
            </div>
          </form>
          <div className="my-2 d-flex flex-row">
            {
              this.state.images.map((img, index) => {
                return (
                  <div className="d-flex flex-column text-center mr-2" key={`graph-components-${index}`}>
                    <img
                      src={img.component}
                      width="90"
                      className="mb-2"
                      alt={img.name}
                    />
                    {
                      img.name === "VM" && (
                        <button
                          className="btn btn-sm btn-outline-success mb-2"
                          onClick={() => this.handleAddNode("VM")}
                        >
                          Add
                        </button>
                      )
                    }
                    {
                      img.name === "Switch" && (
                        <button
                          className="btn btn-sm btn-outline-success mb-2"
                          onClick={() => this.handleAddNode("switch")}
                        >
                          Add
                        </button>
                      )
                    }
                  </div>
                )
              })
            }
            </div>
        </div>
        }
      </div>
    )
  }
}

export default SideNodes;