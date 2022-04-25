import React, { Component } from 'react';
import Link from "../../imgs/SliceComponentIcons/Link.png";
import _ from "lodash";
import ServiceTypeTable from './ServiceTypeTable';

export default class SideLinks extends Component { 
  state = {
    images: [
      {
        id: 1,
        name: "Link",
        component: Link,
      }, 
    ],
    intro: {
      "L2Bridge":{
        "numberOfInterfaces": "Any",
        "numberOfSites": 1,
        "description": "Broadcast service in a single site.",
      },
      "L2PTP": {
        "numberOfInterfaces": 2,
        "numberOfSites": 2,
        "description": "Port-to-Port service between exactly 2 sites.",
      },
      "L2STS": {
        "numberOfInterfaces": "Any",
        "numberOfSites": 2,
        "description": "Site-to-Site service between exactly 2 sites",
      },
      "FABNetv4": {
        "numberOfInterfaces": "Any",
        "numberOfSites": "Any",
        "description": "All interfaces in a given site are part of the same broadcast domain and a single /24 per site using the same gateway. Traffic across sites is routed by FABRIC dataplane.",
      },
      "FABNetv6": {
        "numberOfInterfaces": "Any",
        "numberOfSites": "Any",
        "description": "All interfaces in a given site are part of the same broadcast domain and a single /64 per site using the same gateway. Traffic across sites is routed by FABRIC dataplane.This service also provides the ability to peer with public IPv6 networks.",
      }
    },
    linkType: "",
    linkName: "",
  }
  
  handleServiceTypeChange = (e) => {
    this.setState({ linkType: e.target.value })
  }

  handleLinkNameChange = (e) => {
    this.setState({ linkName: e.target.value })
  }

  handleAddLink = () => {
    const { linkType, linkName } = this.state;
    // type: "L2STS"/ "L2PTP"/ "L2Bridge"
    this.props.onLinkAdd(linkType, linkName);
    this.setState({ linkName: "" });
  }

  raiseRemoveCP = (cp_id) => {
    this.props.onCPRemove(cp_id);
  }

  render() {
    const { intro, linkType, linkName } = this.state;
    return(
      <div>
        {
          this.state.linkType !== "" &&
          <div>
            <div className="mb-1">
              Guide for <span className="font-weight-bold">{linkType}</span> type Network Service
            </div>
            <ServiceTypeTable service={intro[linkType]} />
          </div>
        }
        <form>
          <div className="form-row">
            <div className="form-group slice-builder-form-group col-md-6">
              <label htmlFor="inputComponent" className="slice-builder-label">Service Type</label>
              <select
                className="form-control form-control-sm"
                id="componentSelect"
                onChange={this.handleServiceTypeChange}
                defaultValue=""
              >
                <option>Choose...</option>
                <option value="L2Bridge">L2Bridge</option>
                <option value="L2PTP">L2PTP</option>
                <option value="L2STS">L2STS</option>
                <option value="FABNetv4">FABNetv4</option>
                <option value="FABNetv6">FABNetv6</option>
              </select>
            </div>
            <div className="form-group slice-builder-form-group col-md-6">
                <label htmlFor="inputNodeName" className="slice-builder-label">Service Name</label>
                <input
                  type="text"
                  className="form-control form-control-sm"
                  id="inputServiceName"
                  value={linkName}
                  onChange={this.handleLinkNameChange}
                />
              </div>
            </div>
           <div className="form-row">
            <div className="ml-1 mt-2 slice-builder-label">Click on the graph to select connection points.</div>
            <div className="form-group slice-builder-form-group mt-2 col-md-12">
              <ul className="input-tag__tags">
                {
                  this.props.selectedCPs.length > 0 ? 
                  this.props.selectedCPs.map(cp => <li key={`selectedCP${cp.id}`}>
                    {cp.properties.name}
                  <i
                    className="fa fa-times ml-2"
                    onClick={() => {
                      this.raiseRemoveCP(cp.id);
                    }}
                  ></i>
                </li>) : ""
                }
              </ul>
            </div>
           </div>
        </form>
        <div className="my-2 d-flex flex-row">
        {
          this.state.images.map((img, index) => {
            return (
              <div className="d-flex flex-column text-center mr-2" key={`graph-components-${index}`}>
                <button
                  className="btn btn-sm btn-success mb-2"
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