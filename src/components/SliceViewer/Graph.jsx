import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
// import edgehandles from 'cytoscape-edgehandles';
import COSEBilkent from 'cytoscape-cose-bilkent';
// import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from "file-saver";

import IconGPU from '../../imgs/SliceComponentIcons/GPU.png';
import IconLink from '../../imgs/SliceComponentIcons/Link.png';
import IconSwitch from '../../imgs/SliceComponentIcons/Switch.png';
import IconNIC25G from '../../imgs/SliceComponentIcons/NIC25G.png';
import IconNVMe from '../../imgs/SliceComponentIcons/SSD.png';
import IconFPGA from '../../imgs/SliceComponentIcons/FPGA.png';

Cytoscape.use(COSEBilkent);
// Cytoscape.use(compoundDragAndDrop);
// Cytoscape.use(edgehandles);

function setCytoscape(cy){
  // the default values of each option are outlined below:
  // let defaults = {
  //   preview: true, // whether to show added edges preview before releasing selection
  //   hoverDelay: 150, // time spent hovering over a target node before it is considered selected
  //   handleNodes: 'node', // selector/filter function for whether edges can be made from a given node
  //   snap: false, // when enabled, the edge can be drawn by just moving close to a target node
  //   snapThreshold: 50, // the target node must be less than or equal to this many pixels away from the cursor/finger
  //   snapFrequency: 15, // the number of times per second (Hz) that snap checks done (lower is less expensive)
  //   noEdgeEventsInDraw: false, // set events:no to edges during draws, prevents mouseouts on compounds
  //   disableBrowserGestures: true, // during an edge drawing gesture, disable browser gestures such as two-finger trackpad swipe and pinch-to-zoom
  //   handlePosition: function( node ){
  //     return 'middle top'; // sets the position of the handle in the format of "X-AXIS Y-AXIS" such as "left top", "middle top"
  //   },
  //   handleInDrawMode: false, // whether to show the handle in draw mode
  //   edgeType: function( sourceNode, targetNode ){
  //     // can return 'flat' for flat edges between nodes or 'node' for intermediate node between them
  //     // returning null/undefined means an edge can't be added between the two nodes
  //     return sourceNode.edgesWith( targetNode ).empty() ? 'flat' : null;
  //   },
  //   loopAllowed: function( node ){
  //     // for the specified node, return whether edges from itself to itself are allowed
  //     return false;
  //   },
  //   nodeLoopOffset: -50, // offset for edgeType: 'node' loops
  //   nodeParams: function( sourceNode, targetNode ){
  //     // for edges between the specified source and target
  //     // return element object to be passed to cy.add() for intermediary node
  //     return {};
  //   },
  //   edgeParams: function( sourceNode, targetNode, i ){
  //     // for edges between the specified source and target
  //     // return element object to be passed to cy.add() for edge
  //     // NB: i indicates edge index in case of edgeType: 'node'
  //     return {};
  //   },
  //   ghostEdgeParams: function(){
  //     // return element object to be passed to cy.add() for the ghost edge
  //     // (default classes are always added for you)
  //     return {};
  //   },
  //   show: function( sourceNode ){
  //     // fired when handle is shown
  //   },
  //   hide: function( sourceNode ){
  //     // fired when the handle is hidden
  //   },
  //   start: function( sourceNode ){
  //     // fired when edgehandles interaction starts (drag on handle)
  //   },
  //   complete: function( sourceNode, targetNode, addedEles ){
  //     // fired when edgehandles is done and elements are added
  //   },
  //   stop: function( sourceNode ){
  //     // fired when edgehandles interaction is stopped (either complete with added edges or incomplete)
  //   },
  //   cancel: function( sourceNode, cancelledTargets ){
  //     // fired when edgehandles are cancelled (incomplete gesture)
  //   },
  //   hoverover: function( sourceNode, targetNode ){
  //     // fired when a target is hovered
  //   },
  //   hoverout: function( sourceNode, targetNode ){
  //     // fired when a target isn't hovered anymore
  //   },
  //   previewon: function( sourceNode, targetNode, previewEles ){
  //     // fired when preview is shown
  //   },
  //   previewoff: function( sourceNode, targetNode, previewEles ){
  //     // fired when preview is hidden
  //   },
  //   drawon: function(){
  //     // fired when draw mode enabled
  //   },
  //   drawoff: function(){
  //     // fired when draw mode disabled
  //   }
  // };
  // cy.edgehandles(defaults);
  // cy.compoundDragAndDrop();
  return cy;
}

export default class Graph extends Component { 
  state = {
    w: 0,
    h: 0,
    selectedData: null,
  }

  componentDidMount = () => {
    this.setState({
      w: window.innerWidth * 0.75,
      h:window.innerHeight * 0.75,
     // elements: jsonData.elements.nodes,
    })
    // this.cy can only be declared after the component has been mounted
    // call functions that set up the interactivity inside componentDidMount
    this.setUpListeners();
  }
  
  setUpListeners = () => {
    this.cy.on('click', 'node', (event) => {
      this.setState({selectedData: event.target["_private"].data})
      this.handleNodeSelect();
    });
  }
  
  handleNodeSelect = () => {
    const selectedData = this.state.selectedData;
    this.props.onNodeSelect(selectedData);
  }

  saveJSON = () => {
    var jsonBlob = new Blob([ JSON.stringify( this.cy.json() ) ], { type: 'application/javascript;charset=utf-8' });

    saveAs( jsonBlob, 'graph.json' );
  }

  savePNG = () => {
    var png64 = this.cy.png();
    saveAs( png64, 'graph.png' );
  }

  saveChanges = () =>{
    alert("Successfully saved!")
  }

  render() {
    const layout = { name: 'cose-bilkent' };

    return(
      <div className="border">
        <div className="d-flex flex-row-reverse">
          <button onClick={this.saveJSON} className="btn btn-sm btn-outline-primary ml-2">Download JSON</button>
          <button onClick={this.savePNG} className="btn btn-sm btn-outline-primary">Download PNG</button>
          <button onClick={this.saveChanges} className="btn btn-sm btn-outline-success mr-2">Submit Changes</button>
        </div>
        <CytoscapeComponent
          elements={this.props.elements}
          layout={layout}
          zoom={0.75}
          pan={ { x: 100, y: 75 } }
          style={{ width: this.state.w, height: this.state.h }}
          // wheelSensitivity={0.1}
          cy={(cy) => {this.cy = setCytoscape(cy)}}
          stylesheet={[
            {
              "selector": "node",
              "style": {
                "shape": "data(type)",
                "label": "data(label)",
              }
            },
            {
              "selector": "edge",
              "style": {
                // "label": "data(label)",
                "width": 3,
              }
            },
            {
              "selector": ".graphGPU",
              "style": {
                "background-image": `${IconGPU}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphSite",
              "style": {
                "background-color": "#d3d3d3",
                "min-width": 200,
                "min-height": 200,
              }
            },
            {
              "selector": ".graphVM",
              "style": {
                "background-color": "#fff",
                "min-width": 150,
                "min-height": 150,
              }
            },
            {
              "selector": ".fakeNode",
              "style": {
                "height": 3,
                "width": 3,
              }
            },
            {
              "selector": ".graphSwitchFabric",
              "style": {
                "background-image": `${IconSwitch}`,
                // "min-width": 70,
                // "min-height": 55,
                // "background-fit": "cover",
                "background-color": "#fff",
                "background-fit": "contain",
                "height": 70,
                "width": 100,
                // "min-height-bias-top": 0.9,
              }
            },
            {
              "selector": ".graphSmartNIC",
              "style": {
                "background-image": `${IconNIC25G}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphFPGA",
              "style": {
                "background-image": `${IconFPGA}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphNVMe",
              "style": {
                "background-image": `${IconNVMe}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphLink",
              "style": {
                "background-image": `${IconLink}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 20,
                "width": 40,
              }
            },
            {
              "selector": ".graphInterfaces",
              "style": {
                "height": 15,
                "width": 15,
              }
            },
             // some style for the extension
             {
              selector: '.eh-handle',
              "style": {
                'background-color': '#ff8542',
                'width': 15,
                'height': 15,
                'shape': 'rectangle',
                'overlay-opacity': 0,
                'border-width': 15, // makes the handle easier to hit
                'border-opacity': 0
              }
            },

            {
              selector: '.eh-hover',
              style: {
                'background-color': '#ff8542'
              }
            },

            {
              selector: '.eh-source',
              style: {
                'border-width': 2,
                'border-color': '#ff8542'
              }
            },

            {
              selector: '.eh-target',
              style: {
                'border-width': 2,
                'border-color': '#ff8542'
              }
            },

            {
              selector: '.eh-preview, .eh-ghost-edge',
              style: {
                'background-color': '#ff8542',
                'line-color': '#ff8542',
                'target-arrow-color': '#ff8542',
                'source-arrow-color': '#ff8542'
              }
            },

            // {
            //   selector: '.eh-ghost-edge, .eh-preview-active',
            //   style: {
            //     'opacity': '0'
            //   }
            // }
          ]}
        />
      </div>
    )
  }
}