import React, { Component } from 'react'
import SingleComponent from './SingleComponent';
import validator from  "@/lib/slices/sliceValidator";

export default class SliceEditorDetailForm extends Component {
  state = {
    nodeName: "",
    isNameChanged: false,
    core: 0,
    isCoreChanged: false,
    ram: 0,
    isRamChanged: false,
    disk: 0,
    isDiskChanged: false,
    BootScript: "",
    isBootScriptChanged: false,
    showVMComponent: false,
    validationResult: {
      isValid: true,
      message: ""
    }
  }

  // TODO: refactor code.
  componentWillReceiveProps(props) {
    this.setState({
      nodeName: "",
      isNameChanged: false,
      core: 0,
      isCoreChanged: false,
      ram: 0,
      isRamChanged: false,
      disk: 0,
      isDiskChanged: false,
      showVMComponent: false,
      validationResult: {
        isValid: true,
        message: ""
      }
    })
  }

  handleNameChange = (e) => {
    const nodeName = e.target.value;
    const validationResult = validator.validateDetailForm("name", nodeName, this.props.data.id, this.props.nodes);
    this.setState({ nodeName, validationResult, isNameChanged: true });
  }

  handleCoreChange = (e) => {
    const core = Number(e.target.value);
    const validationResult = validator.validateDetailForm("capacity", core);
    this.setState({ core, validationResult, isCoreChanged: true });
  }

  handleRamChange = (e) => {
    const ram= Number(e.target.value);
    const validationResult = validator.validateDetailForm("capacity", ram);
    this.setState({ ram, validationResult, isRamChanged: true });
  }

  handleDiskChange = (e) => {
    const disk = Number(e.target.value);
    const validationResult = validator.validateDetailForm("capacity", disk);
    this.setState({ disk, validationResult, isDiskChanged: true });
  }

  handleBootScriptChange = (e) => {
    const BootScript = e.target.value;
    this.setState({ BootScript, isBootScriptChanged: true });
  }

  handleShowVMComponent = () => {
    const showOrNot = this.state.showVMComponent;
    this.setState({ showVMComponent: !showOrNot });
  }

  handleVMUpdate = (e) => {
    e.preventDefault();
    const data = this.props.data;
    const { nodeName, core, ram, disk, BootScript, isNameChanged, isCoreChanged,
      isRamChanged, isDiskChanged, isBootScriptChanged } = this.state;
    const newName = isNameChanged ? nodeName : data.properties.name;
    const newCore = isCoreChanged ? core : JSON.parse(data.capacities).core;
    const newRam = isRamChanged ? ram : JSON.parse(data.capacities).ram;
    const newDisk = isDiskChanged ? disk : JSON.parse(data.capacities).disk;
    const newBootScript = isBootScriptChanged ? BootScript : data.BootScript;
    const capacities = JSON.stringify({"core": newCore, "ram": newRam, "disk": newDisk});
    this.props.onVMUpdate({ vm_id: this.props.data.id, new_name: newName, new_capacities: capacities, new_boot_script: newBootScript });
  }

  isCPAvailable = () => {
    const cp_id = parseInt(this.props.data.id);
    // check if there is the CP is a 'connects' source.
    for (const link of this.props.links) {
      if (link.source === cp_id) {
        return false;
      }
    }

    // check if the CP is already selected.
    if (this.props.selectedCPs.length === 0) {
      return true;
    }

    for (const cp of this.props.selectedCPs) {
      if (cp_id === parseInt(cp.id)) {
        return false;
      }
    }

    return true;
  }

  handleSelect = () => {
    this.props.onConnectionPointSelect(this.props.data);
  }

  handleNodeDelete = () => {
    this.props.onNodeDelete(this.props.data);
  }

  handleSingleComponentAdd = (data) => {
    this.props.onSingleComponentAdd(data);
  }

  handleFileDrop = (textStr) => {
    this.props.onJsonUpload(textStr);
  }

  getVMComponents = () => {
    const vm_component_ids = [];

    for (const link of this.props.links) {
      if (link.Class === "has" && link.source === parseInt(this.props.data.id)) {
        vm_component_ids.push(link.target);
      }
    }

    const vm_components = [];

    if (vm_component_ids && vm_component_ids.length > 0) {
      for (const compo_id of vm_component_ids) {
        const node = this.props.nodes.filter(node => node.id === compo_id)[0];
        const vm_component = {
          "type": node.Type,
          "name": node.Name,
          "model": node.Model
        };
        vm_components.push(vm_component);
      }
    }

    return vm_components;
  }

  render() {
    const data = this.props.data;
    let componentKey = "";
    if (data && data.properties) {
      componentKey = `${data.properties.id}-${data.properties.name}`
    }

    const { validationResult } = this.state;

    return (
      <div className="new-slice-detail-form" key={componentKey}>
        <form>
            {
              (!data || !data.properties) && (
                <div className="my-3">
                    <span>
                      <i className="fa fa-info-circle mx-2" />
                      Click an element on the topology to make changes.
                    </span>
                </div>
              )
            }

            {
              data && data.properties && data.properties.class === "CompositeNode" &&
              <div className="form-row px-3">
                <div className="col mb-2">
                  <label className="slice-builder-label">Site Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
              </div>
            }
            {
              data && data.properties && data.properties.type === "Facility" &&
              <div className="form-row px-3">
                <div className="col-11 mb-2">
                  <label className="slice-builder-label">Facility Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-danger w-100"
                    type="button"
                    onClick={this.handleNodeDelete}
                  >
                    Delete
                  </button>
                </div>
                {
                  !validationResult.isValid && validationResult.message !== "" &&
                  <div className="mb-1 sm-alert mx-3">
                    {validationResult.message}
                  </div>
                }
              </div>
            }
            {
              data && data.properties && data.properties.type === "VM" &&
              <div>
                <div className="form-row px-3">
                  <div className="col-3 mb-2">
                    <label className="slice-builder-label">VM Name</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} onChange={this.handleNameChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Cores</label>
                    <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).core} onChange={this.handleCoreChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">RAM(GB)</label>
                    <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).ram} onChange={this.handleRamChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Disk(GB)</label>
                    <input type="number" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).disk} onChange={this.handleDiskChange}/>
                  </div>
                  <div className="col-1 pt-4 pb-2 d-flex flex-row">
                    <button
                      className="btn btn-sm btn-success w-100"
                      type="button"
                      disabled={!validationResult.isValid}
                      onClick={this.handleVMUpdate}
                      >
                        Update
                    </button>
                  </div>
                  <div className="col-1 pt-4 pb-2 d-flex flex-row">
                    <button
                      className="btn btn-sm btn-danger w-100"
                      type="button"
                      onClick={this.handleNodeDelete}
                    >
                      Delete
                    </button>
                  </div>
                  <div className="col-1 pt-4 pb-2 d-flex flex-row">
                    <button
                      className="btn btn-sm btn-primary w-100"
                      type="button"
                      onClick={this.handleShowVMComponent}
                      >
                        {this.state.showVMComponent ? <i className="fa fa-chevron-up"></i> : <i className="fa fa-chevron-down"></i>}
                    </button>
                  </div>
                </div>
                {!validationResult.isValid && validationResult.message !== "" &&
                  <div className="mb-1 sm-alert mx-3">
                    {validationResult.message}
                  </div>
                }
                {
                  this.state.showVMComponent &&
                  <div className="form-row px-3">
                     <div className="col-12">
                      <label htmlFor="BootScript" className="slice-builder-label">Boot Script (optional)</label>
                      <textarea
                        className="form-control"
                        id="BootScript"
                        rows="1"
                        defaultValue={data.BootScript}
                        onChange={this.handleBootScriptChange}
                      />
                     </div>
                     <div className="col-12">
                      <SingleComponent
                        addedComponents={this.getVMComponents()}
                        onSliceComponentAdd={this.handleSingleComponentAdd}
                      />
                     </div>
                  </div>
                }
              </div>
            }

            {
              data && data.properties && data.properties.class === "Component" &&
                <div className="form-row px-3">
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Component Name</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Type</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Model</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.model} disabled/>
                  </div>
                  <div className="col-5 mb-2">
                    <label className="slice-builder-label">Detail</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.detail} disabled/>
                  </div>
                  <div className="col-1 pt-4 pb-2 d-flex flex-row">
                    <button
                      className="btn btn-sm btn-danger ms-auto"
                      type="button"
                      onClick={this.handleNodeDelete}
                    >
                      Delete
                    </button>
                  </div>
                </div>
            }

            {
              data && data.properties && data.properties.class === "ConnectionPoint" &&
              <div className="form-row px-3">
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Connection Point Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={ data.properties.name} disabled/>
                </div>
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Type</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
                </div>
                <div className="col-2 pt-4 pb-2 d-flex flex-row">
                  {
                    data.properties.type !== "ServicePort" && this.isCPAvailable() &&
                    <button
                      className="btn btn-sm btn-success ms-auto"
                      type="button"
                      onClick={this.handleSelect}
                    >
                      Select
                    </button>
                  }
                   {
                    data.properties.type === "ServicePort" && 
                    <button
                      className="btn btn-sm btn-danger ms-auto"
                      type="button"
                      onClick={this.handleNodeDelete}
                    >
                      Delete
                    </button>
                  }
                </div>
              </div>
            }
            {
              data && data.properties && 
              data.properties.class === "NetworkService" &&
              data.properties.type !== "VLAN" &&
              <div className="form-row px-3">
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Network Service Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Type</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
                </div>
                <div className="col-2 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-danger ms-auto"
                    type="button"
                    onClick={this.handleNodeDelete}
                  >
                    Delete
                  </button>
                </div>
              </div>
            }
            {
              data && data.properties && data.properties.type === "VLAN" &&
              <div className="form-row px-3">
                <div className="col-6 mb-2">
                  <label className="slice-builder-label">VLAN Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="col-6 mb-2">
                  <label className="slice-builder-label">Type</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.type} disabled/>
                </div>
              </div>
            }
        </form>
      </div>
      );
  };
}
