import React, { Component } from 'react'

export default class NewSliceDetailForm extends Component {  
  // handleDelete = (e) => {
  //   e.preventDefault();
  //   this.props.onNodeDelete(this.props.data.id);
  // }

  // handleSave = (e) => {
  //   e.preventDefault();
  //   this.props.onNodeUpdate(this.props.data.id);
  // }

  handleSelect = () => {
    this.props.onConnectionPointSelect(this.props.data);
  }

  handleNodeDelete = () => {
    this.props.onNodeDelete(this.props.data);
  }

  render() {
    const data = this.props.data;
    console.log(data)
    return (
      <div className="new-slice-detail-form">
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
              data && data.properties && data.properties.type === "VM" &&
              <div className="form-row px-3">
                <div className="col-4 mb-2">
                  <label className="slice-builder-label">VM Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={data.properties.name} />
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Core</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).core} />
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Ram</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).ram} />
                </div>
                <div className="col-2 mb-2">
                  <label className="slice-builder-label">Disk</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={JSON.parse(data.capacities).disk} />
                </div>
                <div className="col-1 pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-success ml-auto"
                    type="button"
                    onClick={this.handleNodeUpdate}
                    >
                      Update
                  </button>
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
                  <button
                    className="btn btn-sm btn-success ml-auto"
                    type="button"
                    onClick={this.handleSelect}
                  >
                    Select
                  </button>
                </div>
              </div>
            }

            {
              data && data.properties && data.properties.class === "NetworkService" &&
              <div className="form-row px-3">
                <div className="col-5 mb-2">
                  <label className="slice-builder-label">Network Service Name</label>
                  <input type="text" className="form-control form-control-sm" defaultValue={ data.properties.name} disabled/>
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
