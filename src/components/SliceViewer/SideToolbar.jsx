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
          <SideNodes
            nodes={props.nodes}
            resources={props.resources}
            onNodeAdd={ props.onNodeAdd } 
          />
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
         <SideLinks
          selectedCPs={props.selectedCPs}
          nodes={props.nodes}
          onLinkAdd={props.onLinkAdd}
          onCPRemove={props.onCPRemove}
         />
        </div>
      </div>
    </div>
    </div>
  );
};

export default SideToolbar;
