import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
// import edgehandles from 'cytoscape-edgehandles';
import FCose from 'cytoscape-fcose';
// import compoundDragAndDrop from 'cytoscape-compound-drag-and-drop';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from "file-saver";

import IconGPU from '../../imgs/SliceComponentIcons/GPU.png';
import IconLink from '../../imgs/SliceComponentIcons/Link.png';
import IconSwitch from '../../imgs/SliceComponentIcons/Switch.png';
import IconNIC from '../../imgs/SliceComponentIcons/NIC25G.png';
import IconSharedNIC from '../../imgs/SliceComponentIcons/SharedNIC.png';
import IconSmartNIC from '../../imgs/SliceComponentIcons/SmartNIC.png';
import IconNVME from '../../imgs/SliceComponentIcons/NVME.png';
import IconFPGA from '../../imgs/SliceComponentIcons/FPGA.png';
import IconSSD from '../../imgs/SliceComponentIcons/SSD.png';
import IconNS from '../../imgs/SliceComponentIcons/NetworkService.png';

import { OverlayTrigger, Tooltip } from 'react-bootstrap';

Cytoscape.use(FCose);
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
      w: window.innerWidth * this.props.defaultSize.width,
      h:window.innerHeight * this.props.defaultSize.height,
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
    saveAs( jsonBlob, `${this.props.sliceName}.json` );
  }

  savePNG = () => {
    var png64 = this.cy.png({
      'bg': 'white',
      'full': true,
    });
    saveAs( png64, `${this.props.sliceName}.png` );
  }

  saveChanges = () =>{
    alert("Successfully saved!")
  }

  render() {
    const layout = {name: 'fcose'};

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
        </div>
        <CytoscapeComponent
          elements={this.props.elements}
          layout={layout}
          zoom={0.85}
          pan={ { x: 350, y: 275 } }
          style={{ width: this.state.w, height: this.state.h }}
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
              "selector": ".graphNIC",
              "style": {
                "background-image": `${IconNIC}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphSmartNIC",
              "style": {
                "background-image": `${IconSmartNIC}`,
                "background-fit": "contain",
                "background-color": "#fff",
                "height": 70,
                "width": 100,
              }
            },
            {
              "selector": ".graphSharedNIC",
              "style": {
                "background-image": `${IconSharedNIC}`,
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
              "selector": ".graphNVME",
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
            },]
        }
      />
      </div>
    )
  }
}