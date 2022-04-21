import React from "react";
import SideNodes from './SideNodes';
import SideLinks from './SideLinks';

const SideToolbar = (props) => {
  return (
    <div>
    <div className="card">
      <div className="card-header py-1">
        <button className="btn btn-link">
          Step 1: Add Nodes and Components
        </button>
      </div>
      <div>
        <div className="card-body">
          <SideNodes onNodeAdd={ props.onNodeAdd } resources={props.resources} />
        </div>
      </div>
    </div>
    <div className="card">
      <div className="card-header py-1">
        <button className="btn btn-link">
          Step 2: Add Network Service
        </button>
      </div>
      <div>
        <div className="card-body">
         <SideLinks onLinkAdd={props.onLinkAdd} nodes={props.nodes} />
        </div>
      </div>
    </div>
    </div>
  );
};

export default SideToolbar;
