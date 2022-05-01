import React, { Component } from 'react'

export default class DetailForm extends Component {
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
        display: "Core (1~32)",
        field: "core",
        unit: "",
      },
      {
        display: "Ram (1~512 GB)",
        field: "ram",
        unit: "GB",
      },
      {
        display: "Bandwidth (1~100 Gbps)",
        field: "bandwidth",
        unit: "Gbps",
      },
      {
        display: "Disk (1~100 GB)",
        field: "disk",
        unit: "GB",
      },
    ]

    return (
      <div className="w-100 card ml-4">
        <form>
          <div className="card-header">
            Details
          </div>
          <div className="card-body">
            <div className="form-col px-3">
            {
              !data && (
                <span> Click an element to view details. </span>
              )
            }

            {
              properties.map((property) => {
                return (
                  data && data.properties && data.properties[property.field]
                  && (
                    <div className="row mb-2">
                      <label>{ property.display } </label>
                      {
                        property.field === "detail" ? <textarea disabled type="text" className="form-control" placeholder={ data.properties[property.field]} /> :
                        <input disabled type="text" className="form-control" placeholder={ data.properties[property.field]} />
                      }
                    </div>
                  ))})
            }

            {
              capacities.map((capacity) => {
                return (
                  data && data.capacities && data.capacities[capacity.field]
                  && (
                    <div className="row mb-2">
                      <label>{ capacity.display } </label>
                      <input disabled type="text" className="form-control" placeholder={ `${data.capacities[capacity.field]} ${capacity.unit}`} />
                    </div>
                  ))})
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
            </div>
        </form>
      </div>
      );
  };
}
