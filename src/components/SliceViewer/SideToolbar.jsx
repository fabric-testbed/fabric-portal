import React from "react";
import SideNodes from './SideNodes';
import SideComponents from './SideComponents';
import SideLinks from './SideLinks';

const SideToolbar = (props) => {
  return (
    <div>
    <div className="card">
      <div className="card-header py-1">
        <button className="btn btn-link">
          Nodes
        </button>
      </div>
      <div className="show" aria-labelledby="headingOne" aria-expanded="true" data-parent="#accordion">
        <div className="card-body">
          <SideNodes onNodeAdd={ props.onNodeAdd } resources={props.resources} />
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header py-1">
        <h5 className="mb-0">
          <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseTwo" aria-expanded="false" aria-controls="collapseTwo">
            Components
          </button>
        </h5>
      </div>
      <div id="collapseTwo" className="show collapse" aria-labelledby="headingTwo" data-parent="#accordion">
        <div className="card-body">
         <SideComponents 
           onNodeAdd={ props.onNodeAdd }
         />
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header py-1">
        <button className="btn btn-link collapsed" data-toggle="collapse" data-target="#collapseThree" aria-expanded="false" aria-controls="collapseThree">
          Network Service
        </button>
      </div>
      <div id="collapseThree" className="show collapse" aria-labelledby="headingThree" data-parent="#accordion">
        <div className="card-body">
         <SideLinks onNodeAdd={ props.onNodeAdd } />
        </div>
      </div>
    </div>
  </div>
    );
};

export default SideToolbar;
