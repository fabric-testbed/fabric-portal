import React from 'react';
import SiteResourceTable from './SiteResourceTable';

class SideNodes extends React.Component {
  state = {
    selectedSite: "",
    nodeName: "",
    core: 0,
    ram: 0,
    disk: 0,
    nodeType: "",
    componentType: "",
    componentName: "",
  }
  
  handleAddNode = () => {
    // type: "VM" or "switch"
    const { selectedSite, nodeName, nodeType, core, ram, disk, componentType, componentName } = this.state;
    this.props.onNodeAdd(nodeType, selectedSite, nodeName, core, ram, disk, componentType, componentName);
  }

  handleSiteChange = (e) => {
    this.setState({ selectedSite: e.target.value });
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
              <div className="form-group slice-builder-form-group col-md-3">
                <label htmlFor="inputState" className="slice-builder-label">Site</label>
                <select
                  className="form-control form-control-sm"
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
              <div className="form-group slice-builder-form-group col-md-3">
                <label htmlFor="NodeType" className="slice-builder-label">Node Type</label>
                <select
                  className="form-control form-control-sm"
                  id="nodeTypeSelect"
                  onChange={this.handleNodeTypeChange}
                  defaultValue=""
                >
                  <option>Choose...</option>
                  <option value="VM">VM</option>
                  <option value="Server">Server</option>
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-6">
                <label htmlFor="inputNodeName" className="slice-builder-label">Node Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputNodeName"
                  placeholder=""
                  onChange={this.handleNameChange}
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputCore" className="slice-builder-label">Core</label>
                <input type="number" className="form-control form-control-sm" id="inputCore" onChange={this.handleCoreChange}/>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputRam" className="slice-builder-label">Ram</label>
                <input type="number" className="form-control form-control-sm" id="inputRam" onChange={this.handleRamChange}/>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputDisk" className="slice-builder-label">Disk</label>
                <input type="number" className="form-control form-control-sm" id="inputDisk" onChange={this.handleDiskChange}/>
              </div>
            </div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-6">
                <label htmlFor="inputComponent" className="slice-builder-label">Add Component</label>
                <select
                  className="form-control form-control-sm"
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
              <div className="form-group slice-builder-form-group col-md-6">
                <label htmlFor="inputComponentName" className="slice-builder-label">Component Name</label>
                <input
                  type="text" className="form-control form-control-sm" id="inputComponentName"
                  onChange={this.handleComponentNameChange}
                />
              </div>
            </div>
          </form>
          <div className="my-2 d-flex flex-row">
            <button
              className="btn btn-sm btn-outline-success mb-2"
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