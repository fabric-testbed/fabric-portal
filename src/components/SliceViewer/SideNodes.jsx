import React, { Component } from 'react';
import Switch from "../../imgs/SliceComponentIcons/Switch.png";
import Site from "../../imgs/SliceComponentIcons/Site.png";
import VM from "../../imgs/SliceComponentIcons/VM.png";

export default class SideNodes extends Component { 
  state = {
    images: [
      {
        id: 1,
        name: "Switch",
        component: Switch,
      },
      {
        id: 2,
        name: "Site",
        component: Site,
      },
      {
        id: 3,
        name: "VM",
        component: VM,
      },
    ]
  }

  handleAdd = (type) => {
    this.props.onNodeAdd(type);
  }

  render() {
    return(
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
                {
                  img.name === "Site" && (
                    <button
                      className="btn btn-sm btn-outline-success mb-2"
                      data-toggle="modal"
                      data-target="#siteModal"
                    >
                      Add
                    </button>
                  )
                }
                {
                  img.name === "VM" && (
                    <button
                      className="btn btn-sm btn-outline-success mb-2"
                      data-toggle="modal"
                      data-target="#vmModal"
                    >
                      Add
                    </button>
                  )
                }
                {
                  img.name === "Switch" && (
                    <button
                      className="btn btn-sm btn-outline-success mb-2"
                      onClick={ () => this.handleAdd(img.name) }
                    >
                      Add
                    </button>
                  )
                }
              </div>
            )
          })
        }
      </div>
    )
  }
}