import React, { Component } from 'react';
import Cytoscape from 'cytoscape';
import FCose from 'cytoscape-fcose';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from "file-saver";

import IconGPU from '../../imgs/SliceComponentIcons/GPU.png';
import IconLink from '../../imgs/SliceComponentIcons/Link.png';
import IconSharedNIC from '../../imgs/SliceComponentIcons/SharedNIC.png';
import IconSmartNIC from '../../imgs/SliceComponentIcons/SmartNIC.png';
import IconNVME from '../../imgs/SliceComponentIcons/NVME.png';
import IconNS from '../../imgs/SliceComponentIcons/NetworkService.png';
import _ from "lodash";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

Cytoscape.use(FCose);

function setCytoscape(cy){
  return cy;
}

export default class Graph extends Component { 
  state = {
    w: 0,
    h: 0,
  }

  componentDidMount = () => {
    this.setState({
      w: window.innerWidth * this.props.defaultSize.width,
      h: window.innerHeight * this.props.defaultSize.height,
    })
    // this.cy can only be declared after the component has been mounted
    // call functions that set up the interactivity inside componentDidMount
    this.setUpListeners();
  }
  
  setUpListeners = () => {
    const SELECT_THRESHOLD = 200;

    // Refresh Layout
    const refreshLayout = _.debounce(() => {
      const layout = {name: 'fcose', infinite: false};
      this.cy.layout(layout).run()
    }, SELECT_THRESHOLD);

    // apply layout on graph render.
    refreshLayout();

    // refresh layout when elements change.
    this.cy.on('add', 'node',() => {
      refreshLayout();
    });

    this.cy.on('remove', 'node', () => {
      refreshLayout();
    });

    // pass selected node data to parent component.
    this.cy.on('click', 'node', (event) => {
      this.props.onNodeSelect(event.target["_private"].data);
    });
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

  render() {
    const { elements, defaultSize } = this.props;

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
              Download JSON
            </button>
          </OverlayTrigger>
          <button onClick={this.savePNG} className="btn btn-sm btn-outline-primary ml-2">Download PNG</button>
          {
            this.props.isNewSlice && 
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-save-draft-tooltip", "Use the slice graph draft stored in your browser.")}
            >
              <button
                onClick={this.props.onUseDraft}
                disabled={!localStorage.getItem("sliceDraft")}
                className="btn btn-sm btn-outline-success ml-2"
              >
                Use Draft
              </button>
          </OverlayTrigger>
          }
          {
            this.props.isNewSlice &&
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-save-draft-tooltip",
                "Save this slice draft in your current browser. Newly saved draft will override the previous one.")}
            >
              <button onClick={this.props.onSaveDraft} className="btn btn-sm btn-outline-success ml-2">
                Save Draft
              </button>
            </OverlayTrigger>
          }
          {
            this.props.isNewSlice &&
            <button onClick={this.props.onClearGraph} className="btn btn-sm btn-outline-danger">Clear Graph</button>
          }
        </div>
        <CytoscapeComponent
          elements={elements}
          zoom={defaultSize.zoom}
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