import React, { Component } from 'react'
import { ThemeConsumer } from 'styled-components';
import SingleComponent from './SingleComponent';

export default class NewSliceDetailForm extends Component {
  state = {
    nodeName: "",
    core: 0,
    ram: 0,
    disk: 0,
    showVMComponent: false,
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

  handleShowVMComponent = () => {
    const showOrNot = this.state.showVMComponent;
    this.setState({ showVMComponent: !showOrNot });
  }

  handleVMUpdate = (e) => {
    e.preventDefault();
    const { nodeName, core, ram, disk } = this.state;
    const capacities = JSON.stringify({"core": core, "ram": ram, "disk": disk});
    this.props.onVMUpdate({ vm_id: this.props.data.id, new_name: nodeName, new_capacities: capacities });
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
    this.setState({ showVMComponent: false });
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
    console.log(data)
    let componentKey = "";
    if (data && data.properties) {
      componentKey = `${data.properties.id}-${data.properties.name}`
    }

    return (
      <div className="new-slice-detail-form" key={componentKey}>
        <form>
            {
              (!data || !data.properties) && (
                <div className="my-3"><i className="fa fa-info-circle mx-2" />Click an element on the graph to view details or make changes. </div>
              )
            }

            {
              data && data.properties && data.properties.class === "Composite Node" &&
              <div className="form-row px-3">
                <div className="col mb-2">
                  <label className="slice-builder-label">Site Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} disabled/>
                </div>
              </div>
            }
            
            {
              data && data.properties && data.properties.type === "VM" && <div>
                <div className="form-row px-3">
                  <div className="col-3 mb-2">
                    <label className="slice-builder-label">VM Name</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} onChange={this.handleNameChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Core</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).core} onChange={this.handleCoreChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Ram</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).ram} onChange={this.handleRamChange}/>
                  </div>
                  <div className="col-2 mb-2">
                    <label className="slice-builder-label">Disk</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).disk} onChange={this.handleDiskChange}/>
                  </div>
                  <div className="col-1 pt-4 pb-2 d-flex flex-row">
                    <button
                      className="btn btn-sm btn-success w-100"
                      type="button"
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
                {
                  this.state.showVMComponent &&
                  <div className="form-row px-3">
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
                    className="btn btn-sm btn-danger ml-auto"
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
                      className="btn btn-sm btn-success ml-auto"
                      type="button"
                      onClick={this.handleSelect}
                    >
                      Select
                    </button>
                  }
                   {
                    data.properties.type === "ServicePort" && 
                    <button
                      className="btn btn-sm btn-danger ml-auto"
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
              data && data.properties && data.properties.class === "NetworkService" &&
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
                      className="btn btn-sm btn-danger ml-auto"
                      type="button"
                      onClick={this.handleNodeDelete}
                    >
                      Delete
                    </button>
                </div>
              </div>
            }
        </form>
      </div>
      );
  };
}
