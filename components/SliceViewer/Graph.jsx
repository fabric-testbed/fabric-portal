import React, { useState, useEffect, useRef } from 'react';
import Cytoscape from 'cytoscape';
import FCose from 'cytoscape-fcose';
import CytoscapeComponent from 'react-cytoscapejs';
import { saveAs } from "file-saver";
import _ from "lodash";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

Cytoscape.use(FCose);

function setCytoscape(cy){
  return cy;
}

export default function Graph({ elements, defaultSize, onNodeSelect, sliceName, isNewSlice, onSaveJSON, onUseDraft, onSaveDraft, onClearGraph }) {
  const [w, setW] = useState(0);
  const [h, setH] = useState(0);
  const cyRef = useRef(null);

  useEffect(() => {
    setW(window.innerWidth * defaultSize.width);
    setH(window.innerHeight * defaultSize.height);
    setUpListeners();
  }, []);

  const setUpListeners = () => {
    const SELECT_THRESHOLD = 200;

    const refreshLayout = _.debounce(() => {
      const layout = {name: 'fcose', infinite: false};
      cyRef.current.layout(layout).run()
    }, SELECT_THRESHOLD);

    refreshLayout();

    cyRef.current.on('add', 'node',() => {
      refreshLayout();
    });

    cyRef.current.on('remove', 'node', () => {
      refreshLayout();
    });

    cyRef.current.on('click', 'node', (event) => {
      onNodeSelect(event.target["_private"].data);
    });
  }

  const resetGraph = () => {
    const SELECT_THRESHOLD = 200;

    const refreshLayout = _.debounce(() => {
      const layout = {name: 'fcose', infinite: false};
      cyRef.current.layout(layout).run()
    }, SELECT_THRESHOLD);

    refreshLayout();
  }

  const savePNG = () => {
    var png64 = cyRef.current.png({
      'bg': 'white',
      'full': true,
    });
    saveAs( png64, `${sliceName}.png` );
  }

  const renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  return(
    <div className="border">
      <div className="d-flex flex-row justify-content-between">
        <button onClick={resetGraph} className="btn btn-sm btn-outline-primary">
          Reset Layout
        </button>
        <div className="d-flex flex-row-reverse">
          {
            isNewSlice &&
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-download-tooltip", "Export the topology setup as JSON file.")}
            >
              <button onClick={onSaveJSON} className="btn btn-sm btn-outline-primary ms-2">
                Download JSON
              </button>
            </OverlayTrigger>
          }
          <button onClick={savePNG} className="btn btn-sm btn-outline-primary ms-2">Download PNG</button>
          {
            isNewSlice &&
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-save-draft-tooltip", "Use the slice topology draft stored in your browser.")}
            >
              <button
                onClick={onUseDraft}
                disabled={!localStorage.getItem("sliceDraft")}
                className="btn btn-sm btn-outline-success ms-2"
              >
                Use Draft
              </button>
          </OverlayTrigger>
          }
          {
            isNewSlice &&
            <OverlayTrigger
              placement="top"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("slice-save-draft-tooltip",
                "Save this slice draft in your current browser. Newly saved draft will override the previous one.")}
            >
              <button onClick={onSaveDraft} className="btn btn-sm btn-outline-success ms-2">
                Save Draft
              </button>
            </OverlayTrigger>
          }
          {
            isNewSlice &&
            <button onClick={onClearGraph} className="btn btn-sm btn-outline-danger">Clear Topology</button>
          }
        </div>
      </div>
      <CytoscapeComponent
        elements={elements}
        zoom={defaultSize.zoom}
        pan={ { x: 350, y: 275 } }
        wheelSensitivity={0.1}
        style={{ width: w, height: h }}
        cy={(cy) => {cyRef.current = setCytoscape(cy)}}
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
              "background-image": `/imgs/SliceComponentIcons/GPU.png`,
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
            "selector": ".graphFacility",
            "style": {
              "background-color": "#fff",
              "min-width": 150,
              "min-height": 150,
            }
          },
          {
            "selector": ".graphSmartNIC",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/SmartNIC.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphSharedNIC",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/SharedNIC.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphFPGA",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/FPGA.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphNVME",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/NVME.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphStorage",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/RotatingStorage.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphSwitch",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/Switch.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 70,
              "width": 100,
            }
          },
          {
            "selector": ".graphLink",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/Link.png`,
              "background-fit": "contain",
              "background-color": "#fff",
              "height": 20,
              "width": 40,
            }
          },
          {
            "selector": ".graphNetworkService",
            "style": {
              "background-image": `/imgs/SliceComponentIcons/NetworkService.png`,
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
