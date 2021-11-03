import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
// import edgehandles from 'cytoscape-edgehandles';
import COSEBilkent from 'cytoscape-cose-bilkent';
// import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from "file-saver";

// import IconVM from '../../imgs/SliceComponentIcons/VM.png';
import IconGPU from '../../imgs/SliceComponentIcons/GPU.png';
import IconLink from '../../imgs/SliceComponentIcons/Link.png';
import IconSwitch from '../../imgs/SliceComponentIcons/Switch.png';
import IconNIC25G from '../../imgs/SliceComponentIcons/NIC25G.png';
import IconNVME from '../../imgs/SliceComponentIcons/NVME.png';
import IconFPGA from '../../imgs/SliceComponentIcons/FPGA.png';
import IconSSD from '../../imgs/SliceComponentIcons/SSD.png';
import IconNS from '../../imgs/SliceComponentIcons/NetworkService.png';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

Cytoscape.use(COSEBilkent);
// Cytoscape.use(compoundDragAndDrop);
// Cytoscape.use(edgehandles);

function setCytoscape(cy){
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
    const layout = {
      name: 'cose-bilkent',
      // Called on `layoutready`
      ready: function () {
      },
      // Called on `layoutstop`
      stop: function () {
      },
    };

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

    return(
      <div className="border">
        <div className="d-flex flex-row-reverse">
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-download-tooltip", "Export the graph in the Cytoscape JSON format used at initialisation.")}
            >
              <button onClick={this.saveJSON} className="btn btn-sm btn-outline-primary ml-2">
                Download in JSON
              </button>
            </OverlayTrigger>
          
          <button onClick={this.savePNG} className="btn btn-sm btn-outline-primary">Download in PNG</button>
          {/* <button onClick={this.saveChanges} className="btn btn-sm btn-outline-success mr-2">Submit Changes</button> */}
        </div>
        <CytoscapeComponent
          elements={this.props.elements}
          layout={layout}
          zoom={0.75}
          pan={ { x: 150, y: 175 } }
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
              "selector": ".graphVM",
              "style": {
                // "background-image": `${IconVM}`,
                // "background-fit": "contain",
                "background-color": "#fff",
                "min-width": 150,
                "min-height": 150,
              }
            },
            {
              "selector": ".graphSwitchFabric",
              "style": {
                "background-image": `${IconSwitch}`,
                "background-color": "#fff",
                "background-fit": "contain",
                "height": 70,
                "width": 100,
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
              "selector": ".graphSharedNIC",
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
                "background-image": `${IconNVME}`,
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
              "selector": ".graphNetworkService",
              "style": {
                "background-image": `${IconNS}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 20,
                "width": 40,
              }
            },
            {
              "selector": ".graphSSD",
              "style": {
                "background-image": `${IconSSD}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 20,
                "width": 40,
              }
            },
            {
              "selector": ".graphSwitch",
              "style": {
                "background-image": `${IconSwitch}`,
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
          ]}
        />
      </div>
    )
  }
}