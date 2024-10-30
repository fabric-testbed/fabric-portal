import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import validator from  "../../utils/sliceValidator";
import { default as portalData } from "../../services/portalData.json";

export default class SingleComponent extends Component { 
  state = {
    componentTypeModel: {
      "GPU": ["RTX6000", "Tesla T4", "A30", "A40"],
      "SmartNIC": ["ConnectX-6", "ConnectX-5"],
      "SharedNIC": ["ConnectX-6"],
      "FPGA": ["Xilinx-U280"],
      "NVME": ["P4510"],
      "Storage": ["NAS"]
    },
    modelDetails: {
      "RTX6000": "NVIDIA Corporation TU102GL [Quadro RTX 6000/8000] (rev a1)",
      "Tesla T4": "NVIDIA Corporation TU104GL [Tesla T4] (rev a1)",
      "A30": "NVIDIA Corporation GA100GL [A30 PCIe] (rev a1)",
      "A40": "NVIDIA Corporation GA102GL [A40] (rev a1)",
      "ConnectX-6": "Mellanox ConnectX-6 VPI MCX653 dual port 100Gbps",
      "ConnectX-5": "Mellanox ConnectX-5 Dual Port 10/25GbE",
      // "OpenStack-vNIC": "OpenStack virtual vNIC typically 1Gbps",
      "P4510": "Dell Express Flash NVMe P4510 1TB SFF",
      "NAS": "Site-local NAS share",
      "Xilinx-U280": "Xilinx U280 FPGA Dual 100G port accelerator card"
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
    const validationResult = validator.validateSingleComponent(componentType, componentName, componentModel, this.props.addedComponents);
    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return(
      <div>
        {
          !this.props.component ?
          <div>
            <div className="form-row">
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputComponent" className="slice-builder-label">
                  Component Type
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 100, hide: 300 }}
                    overlay={renderTooltip("component-tooltip", portalData.helperText.componentDescription)}
                  >
                    <i className="fa fa-question-circle text-secondary ms-2"></i>
                  </OverlayTrigger>
                </label>
                <select
                  className="form-control form-control-sm"
                  id="componentSelect"
                  value={componentType}
                  onChange={this.handleComponentTypeChange}
                >
                  <option value="">Choose...</option>
                  <option value="GPU">GPU</option>
                  <option value="SmartNIC">SmartNIC</option>
                  <option value="SharedNIC">SharedNIC</option>
                  <option value="FPGA">FPGA</option>
                  <option value="NVME">NVME</option>
                  <option value="Storage">Storage</option>
                </select>
              </div>
              <div className="form-group slice-builder-form-group col-md-3">
                <label htmlFor="inputComponentName" className="slice-builder-label">Name</label>
                <input
                  type="text" className="form-control form-control-sm" id="inputComponentName"
                  value={componentName}
                  onChange={this.handleComponentNameChange}
                  placeholder={"at least 2 characters..."}
                />
              </div>
              <div className="form-group slice-builder-form-group col-md-4">
                <label htmlFor="inputComponent" className="slice-builder-label">Model</label>
                <select
                  className="form-control form-control-sm"
                  id="componentSelect"
                  disabled={componentType === ""}
                  value={componentModel}
                  onChange={this.handleComponentModelChange}
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
                  disabled={!validationResult.isValid}
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
            {!validationResult.isValid && validationResult.message !== "" &&
              <div className="my-2 sm-alert">
                {validationResult.message}
              </div>
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