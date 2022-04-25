import React, { Component } from 'react';

export default class SingleComponent extends Component { 
  state = {
    componentTypeModel: {
      "GPU": ["RTX6000", "Tesla T4"],
      "SmartNIC": ["ConnectX-6", "ConnectX-5"],
      "SharedNIC": ["ConnectX-6"],
      "NVME": ["P4510"]
    },
    modelDetails: {
      "RTX6000": "NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] (rev a1)",
      "Tesla T4": "NVIDIA Corporation TU104GL [Tesla T4] (rev a1)",
      "ConnectX-6": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps",
      "ConnectX-5": "Mellanox ConnectX-5 Dual Port 10/25GbE",
      "P4510": "Dell Express Flash NVMe P4510 1TB SFF",
    },
    componentType: "",
    componentName: "",
    componentModel: "",
  }
  
  handleComponentAdd = () => {
    const nodeComponent = {
      "type": this.state.componentType,
      "name": this.state.componentName,
      "model": this.state.componentModel 
    };

    this.setState({ componentType: "", componentName: "", componentModel: ""});

    this.props.onSliceComponentAdd(nodeComponent);
  }

  handleComponentDelete = () => {
    this.props.onSliceComponentDelete(this.props.component);
  }

  handleComponentTypeChange = (e) => {
    this.setState({ componentType: e.target.value, componentModel: "" });
  }

  handleComponentNameChange = (e) => {
    this.setState({ componentName: e.target.value });
  }

  handleComponentModelChange = (e) => {
    this.setState({ componentModel: e.target.value });
  }

  render() {
    const { componentTypeModel, componentType, componentName, componentModel, modelDetails } = this.state;

    return(
      <div>
        {
          !this.props.component ?
          <div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-3">
                <label htmlFor="inputComponent" className="slice-builder-label">Add Component</label>
                <select
                  className="form-control form-control-sm"
                  id="componentSelect"
                  onChange={this.handleComponentTypeChange}
                  defaultValue={componentType}
                >
                  <option>Choose...</option>
                  <option value="GPU">GPU</option>
                  <option value="SmartNIC">SmartNIC</option>
                  <option value="SharedNIC">SharedNIC</option>
                  <option value="NVME">NVME</option>
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputComponentName" className="slice-builder-label">Component Name</label>
                <input
                  type="text" className="form-control form-control-sm" id="inputComponentName"
                  value={componentName}
                  onChange={this.handleComponentNameChange}
                />
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputComponent" className="slice-builder-label">Component Model</label>
                <select
                  className="form-control form-control-sm"
                  id="componentSelect"
                  onChange={this.handleComponentModelChange}
                  disabled={componentType === ""}
                  defaultValue={componentModel}
                >
                  <option value="">Choose...</option>
                  {
                    componentType !== "" && 
                    componentTypeModel[componentType].map(model => 
                      <option value={model} key={model}>{model}</option>
                    )
                  }
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-1">
                <button
                  className="btn btn-sm btn-outline-success mt-4"
                  type="button"
                  onClick={this.handleComponentAdd}
                >
                  <i className="fa fa-plus"></i>
                </button>
              </div>
            </div>
            {
              componentModel !== "" && componentModel !== "" && 
              <span className="text-sm-size mb-2 badge badge-secondary">
                {
                  'Model Details: ' + modelDetails[componentModel]
                }
              </span>
            }
          </div> 
          : 
          <div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-3">
                <select
                  className="form-control form-control-sm"
                  disabled
                >
                  <option>{this.props.component.type}</option>
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <input
                  type="text"
                  className="form-control form-control-sm"
                  defaultValue={this.props.component.name}
                  disabled
                />
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <select
                  className="form-control form-control-sm"
                  disabled
                >
                  <option>{this.props.component.model}</option>
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-1">
                <button
                  className="btn btn-sm btn-outline-danger"
                  type="button"
                  onClick={this.handleComponentDelete}
                >
                  <i className="fa fa-remove"></i>
                </button>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}