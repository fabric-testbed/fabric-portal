import React, { Component } from 'react'

export default class DetailForm extends Component {  
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

    return (
      <div className="w-100 border px-4 py-3">
        <form>
        <div className="form-row">
          {
            !data && (
              <span> Click an element to view details. </span>
            )
          }
          
          {
            data && data.properties && data.properties.name && (
              <div className="col">
              <label>Name</label>
              <input type="text" className="form-control" placeholder={ data.properties.name} />
            </div>
            )
          }

          {
            data && data.label && (
            <div className="col">
              <label>Type</label>
              <input type="text" className="form-control" placeholder={ data.label } />
            </div>
            )
          }
          {
            data && data.capacities && data.capacities.core && (
              <div className="col">
              <label>Core (1~32)</label>
              <input type="text" className="form-control" placeholder={data.capacities.core} />
            </div>
            )
          }
          {
            data && data.capacities && data.capacities.ram && (
              <div className="col">
              <label>Ram (1~512 GB)</label>
              <input type="text" className="form-control" placeholder={`${data.capacities.ram} GB`} />
            </div>
            )
          }
          {
            data && data.capacities && data.capacities.bandwidth && (
              <div className="col">
              <label>Bandwidth (1~100 Gbps)</label>
              <input type="text" className="form-control" placeholder={`${data.capacities.bandwidth} Gbps`} />
            </div>
            )
          }
          {
            data && data.capacities && data.capacities.disk && (
              <div className="col">
              <label>Disk (1~100 GB)</label>
              <input type="text" className="form-control" placeholder={`${data.capacities.disk} GB`} />
            </div>
            )
          }

          {
            data && data.properties && data.properties.model && (
              <div className="col">
              <label>Model</label>
              <input type="text" className="form-control" placeholder={ data.properties.model} />
            </div>
            )
          }

          {
            data && data.properties && data.properties.class && (
              <div className="col">
              <label>Class</label>
              <input type="text" className="form-control" placeholder={ data.properties.class} />
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