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