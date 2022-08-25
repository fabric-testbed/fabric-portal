import React, { Component } from 'react'

export default class DetailForm extends Component {
  render() {
    const data = this.props.data;

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
              data && data.properties && data.properties.class === "CompositeNode" &&
                <div className="row mb-2">
                  <label>Site Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
            }

            {
              data && data.properties && data.properties.type === "VM" &&
              <div>
                <div className="row mb-2">
                  <label>VM Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Cores</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.core} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Ram(GB)</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.ram} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Disk(GB)</label>
                  <input type="number" className="form-control" defaultValue={data.capacities.disk} disabled />
                </div>
              </div>
            }

            {
              data && data.properties && data.properties.class === "Component" &&
              <div>
                <div className="row mb-2">
                  <label >Component Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Model</label>
                  <input type="text" className="form-control" defaultValue={data.properties.model} disabled/>
                </div>
                <div className="row mb-2">
                  <label >Detail</label>
                  <textarea disabled type="text" className="form-control" placeholder={data.properties.detail} />
                </div>
              </div>
            }

            {data && data.properties && data.properties.class === "ConnectionPoint" &&
              <div>
                <div className="row mb-2">
                  <label>Connection Point Name</label>
                  <input type="text" className="form-control" defaultValue={ data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
              </div>
            }

            {
              data && data.properties && data.properties.class === "NetworkService" &&
              <div>
                <div className="row mb-2">
                  <label>Network Service Name</label>
                  <input type="text" className="form-control" defaultValue={data.properties.name} disabled/>
                </div>
                <div className="row mb-2">
                  <label>Type</label>
                  <input type="text" className="form-control" defaultValue={data.properties.type} disabled/>
                </div>
              </div>
            }
            </div>
            </div>
        </form>
      </div>
      );
  };
}
