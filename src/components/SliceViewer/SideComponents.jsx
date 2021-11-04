import React, { Component } from 'react';
import GPU from "../../imgs/SliceComponentIcons/GPU.png";
import NIC25G from "../../imgs/SliceComponentIcons/NIC25G.png";
import FPGA from "../../imgs/SliceComponentIcons/FPGA.png";
import NVMe from "../../imgs/SliceComponentIcons/SSD.png";

export default class SideComponents extends Component { 
  state = {
    images: [
      {
        id: 1,
        name: "GPU",
        component: GPU,
      }, 
      {
        id: 2,
        name: "NIC25G",
        component: NIC25G,
      },
      {
        id: 3,
        name: "FPGA",
        component: FPGA,
      }, 
      {
        id: 4,
        name: "NVMe",
        component: NVMe,
      }, 
    ],
  }
  
  handleAdd = (type) => {
    this.props.onNodeAdd(type);
  }

  render() {
    return(
      <div className="my-2 d-flex flex-row flex-wrap">
        {
          this.state.images.map((img, index) => {
            return (
              <div className="d-flex flex-column text-center mr-2" key={`graph-components-${index}`}>
                <img
                  src={img.component}
                  width="90"
                  className="d-inline-block align-top mb-2"
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
    )
  }
}