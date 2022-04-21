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

    return (
      <div className="new-slice-detail-form">
        <form>
            <div className="form-row px-3">
            {
              !data && (
                <div className="my-2"><i className="fa fa-info-circle" /> Click an element on the graph to view details or make changes. </div>
              )
            }

            {
              properties.map((property) => {
                return (
                  data && data.properties && data.properties[property.field]
                  && (
                    <div className="col mb-2">
                      <label className="slice-builder-label">{ property.display } </label>
                      {
                        property.field === "detail" ? <textarea type="text" className="form-control form-control-sm" value={ data.properties[property.field]} /> :
                        <input type="text" className="form-control form-control-sm" value={ data.properties[property.field]} />
                      }
                    </div>
                  ))})
            }

            {
              capacities.map((capacity) => {
                return (
                  data && data.capacities && data.capacities[capacity.field]
                  && (
                    <div className="col mb-2">
                      <label className="slice-builder-label">{ capacity.display } </label>
                      <input type="text" className="form-control form-control-sm" value={ `${data.capacities[capacity.field]}`} />
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
        </form>
      </div>
      );
  };
}
