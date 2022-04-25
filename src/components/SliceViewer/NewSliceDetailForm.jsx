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

  handleSelect = (e) => {
    e.preventDefault();
    this.props.onConnectionPointSelect(this.props.data);
  }

  render() {
    const data = this.props.data;
    const properties = [
      {
        display: "Name",
        field: "name",
      },
      {
        display: "Model",
        field: "model",
      },
      {
        display: "Detail",
        field: "detail",
      },
    ]

    const capacities = [
      {
        display: "Unit",
        field: "unit",
        unit: "",
      },
      {
        display: "Core",
        field: "core",
        unit: "",
      },
      {
        display: "Ram",
        field: "ram",
        unit: "GB",
      },
      {
        display: "Bandwidth",
        field: "bandwidth",
        unit: "Gbps",
      },
      {
        display: "Disk",
        field: "disk",
        unit: "GB",
      },
    ]

    console.log(data)

    return (
      <div className="new-slice-detail-form">
        <form>
            <div className="form-row px-3">
            {
              !data && (
                <div className="my-3"><i className="fa fa-info-circle mx-2" />Click an element on the graph to view details or make changes. </div>
              )
            }

            {
              properties.map((property) => {
                return (
                  data && data.properties && data.properties[property.field]
                  && (
                    <div className="col mb-2">
                      <label className="slice-builder-label">{ property.display } </label>
                      {/* {
                        property.field === "detail" ? <textarea type="text" className="form-control form-control-sm node-detail-textarea" defaultValue={ data.properties[property.field]} /> :
                        <input type="text" className="form-control form-control-sm" defaultValue={ data.properties[property.field]} />
                      } */}
                      <input type="text" className="form-control form-control-sm" defaultValue={ data.properties[property.field]} />
                    </div>
                  ))})
            }

            {/* {
              properties.class === "NetworkService" &&
                <div>
                  <div className="col mb-2">
                    <label className="slice-builder-label">Name</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={ data.properties["name"]} />
                  </div>
                  <div className="col mb-2">
                    <label className="slice-builder-label">Type</label>
                    <input type="text" className="form-control form-control-sm" defaultValue={ data.properties["type"]} />
                  </div>
                </div> 
            } */}

            {
              capacities.map((capacity) => {
                return (
                  data && data.capacities && data.capacities[capacity.field]
                  && (
                    <div className="col mb-2">
                      <label className="slice-builder-label">{ capacity.display } </label>
                      <input type="text" className="form-control form-control-sm" defaultValue={ `${data.capacities[capacity.field]}`} />
                    </div>
                  ))})
            }
            {
              data && data.properties && data.properties.class==="ConnectionPoint" && (
                <div className="col pt-4 pb-2 d-flex flex-row">
                  <button
                    className="btn btn-sm btn-success ml-auto"
                    onClick={this.handleSelect}
                  >
                    Select
                  </button>
              </div>
              )
            }
            </div>
            {/* {
              data && data.properties && !data.properties.is_interface && (
                <div className="mt-2">
                  <button
                    className="btn btn-outline-success mr-2"
                    onClick={this.handleSave}
                  >
                    Update
                  </button>
                  <button
                    className="btn btn-outline-danger mr-2"
                    onClick={this.handleDelete}
                  >
                    Delete
                  </button>
                </div>
              )
            } */}
        </form>
      </div>
      );
  };
}
