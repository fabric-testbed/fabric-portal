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
    ],
    linkType: "",
    linkName: "",
    nodeID1: 2,
    nodeID2: 5,
  }
  
  handleServiceTypeChange = (e) => {
    this.setState({ linkType: e.target.value })
  }

  handleAddLink = () => {
    const { linkType, linkName, nodeID1, nodeID2 } = this.state;
    // type: "L2STS"/ "L2PTP"/ "L2Bridge"
    this.props.onLinkAdd(linkType, linkName, nodeID1, nodeID2);
  }

  getConnectionPoints = () => {
    const nodes = this.props.nodes;
    const cp_nodes = [];
    for (const node of nodes) {
      if (node.Class === "ConnectionPoint") {
        cp_nodes.push(node);
      }
    }
    
    return cp_nodes;
  }

  render() {
    this.getConnectionPoints();
    return(
      <div>
        <form>
          <div className="form-row">
            <div className="form-group col-md-6">
              <label htmlFor="inputComponent">Service Type</label>
              <select
                className="form-control"
                id="componentSelect"
                onChange={this.handleServiceTypeChange}
                defaultValue=""
              >
                <option>Choose...</option>
                <option value="L2STS">L2STS</option>
                <option value="L2Bridge">L2Bridge</option>
                <option value="L2PTP">L2PTP</option>
              </select>
            </div>
            <div className="form-group col-md-6">
                <label htmlFor="inputNodeName">Service Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="inputServiceName"
                  placeholder=""
                  onChange={this.handleNameChange}
                />
              </div>
            </div>
           <div className="form-row">
            <div>Select 2 Connection Points</div>
            <div className="form-group col-md-12">
              <div className="form-check form-check-inline">
                {
                  this.getConnectionPoints().map(cp => <span className="mr-2">
                    <input className="form-check-input" type="checkbox" id={cp.Name} value={cp.id} />
                    <label className="form-check-label" for={cp.Name}>{cp.Name}</label>
                  </span>)
                }
              </div>
            </div>
           </div>
        </form>
        <div className="my-2 d-flex flex-row">
        {
          this.state.images.map((img, index) => {
            return (
              <div className="d-flex flex-column text-center mr-2" key={`graph-components-${index}`}>
                {/* <img
                  src={img.component}
                  width="90"
                  className="mb-2"
                  alt={img.name}
                /> */}
                <button
                  className="btn btn-sm btn-outline-success mb-2"
                  onClick={()=> this.handleAddLink()}
                >
                  Add Link
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