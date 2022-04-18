import React, { Component } from 'react';
import Link from "../../imgs/SliceComponentIcons/Link.png";

export default class SideLinks extends Component { 
  state = {
    images: [
      {
        id: 1,
        name: "Link",
        component: Link,
      }, 
    ]
  }
  
  handleAddLink = (type) => {
    // type: "l2sts"
    this.props.onNodeAdd(type);
  }

  render() {
    return(
      <div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputComponent">Service Type</label>
              <select
                className="form-control"
                id="componentSelect"
                onChange={this.handleComponentChange}
                defaultValue=""
              >
                <option>Choose...</option>
                <option value="L2STS">L2STS</option>
                <option value="L2Bridge">L2Bridge</option>
                <option value="L2PTP">L2PTP</option>
              </select>
            </div>
          </div>
        </form>
        <div className="my-2 d-flex flex-row">
        {
          this.state.images.map((img, index) => {
            return (
              <div className="d-flex flex-column text-center mr-2" key={`graph-components-${index}`}>
                <img
                  src={img.component}
                  width="90"
                  className="mb-2"
                  alt={img.name}
                />
                <button
                  className="btn btn-sm btn-outline-success mb-2"
                  onClick={ () => this.handleAdd(img.name) }
                >
                  Add
                </button>
              </div>
            )
          })
        }
        </div>
      </div>
    )
  }
}