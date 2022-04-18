import React from 'react';
import Switch from "../../imgs/SliceComponentIcons/Switch.png";
import Site from "../../imgs/SliceComponentIcons/Site.png";
import VM from "../../imgs/SliceComponentIcons/VM.png";

class SideNodes extends React.Component {
  state = {
    images: [
      // {
      //   id: 1,
      //   name: "Site",
      //   component: Site,
      // },
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
    component: "",
    componentName: "",
  }
  
  handleAddNode = (type) => {
    // type: "vm" or "switch"
    const { selectedSite, nodeName, core, ram, disk, component, componentName } = this.state;
    this.props.onNodeAdd(type, selectedSite, nodeName, core, ram, disk, component, componentName);
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

  handleComponentChange = (e) => {
    this.setState({ component: e.target.value });
  }

  handleComponentNameChange = (e) => {
    this.setState({ componentName: e.target.value });
  }

  render() {
    return(
      <div>
        {this.props.resources !== null &&
          <div>
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
                      img.name === "Site" && (
                        <button
                          className="btn btn-sm btn-outline-success mb-2"
                          onClick={() => this.handleAddNode("site")}
                        >
                          Add
                        </button>
                      )
                    }
                    {
                      img.name === "VM" && (
                        <button
                          className="btn btn-sm btn-outline-success mb-2"
                          onClick={() => this.handleAddNode("vm")}
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
          <form>
            <div className="form-row">
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
                  onChange={this.handleComponentChange}
                  defaultValue=""
                >
                  <option>Choose...</option>
                  <option value="GPU">GPU</option>
                  <option value="NIC">NIC</option>
                  <option value="FPGA">FPGA</option>
                  <option value="SSD">SSD</option>
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
        </div>
        }
      </div>
    )
  }
}

export default SideNodes;