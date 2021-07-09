import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Line,
  Marker,
} from "react-simple-maps";

import { topomap } from "../../data/topomap.js"

const geoUrl = "https://raw.githubusercontent.com/zcreativelabs/react-simple-maps/master/topojson-maps/world-110m.json";

const Topomap = props => {
  const [position, setPosition] = useState({ coordinates: [-95, 35], zoom: 3 });

  function handleZoomIn() {
    if (position.zoom >= 4) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 2 }));
    console.log(props.sites)
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  function checkStatus(name) {
    // return "up" or "down" 
    return props.sites.includes(name) ? "up" : "down";
  }

  return (
    <div>
      <ComposableMap
        projection="geoEqualEarth"
        width={800}
        height={500}
        projectionConfig={{
          scale: 300,
          center: [ -55, 15],
        }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1}
          maxZoom={3}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies
            geography={geoUrl}
            fill="#EEEEEE"
            stroke="#FFFFFF"
            strokeWidth={0.5}
          >
            {({ geographies }) =>
              geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
            }
          </Geographies>

          {topomap.fab_lines.map(({ from, to }) => (
            <Line
              key={`line-${from}-to-${to}`}
              from={topomap.coordinates[from]}
              to={topomap.coordinates[to]}
              stroke="#6edcff"
              strokeWidth={1}
              strokeLinecap="round"
              onMouseEnter={() => {
                // console.log("Hello" + from);
              }}
            />
          ))}

          {topomap.usa_lines_super.map(({ from, to }) => (
              <Line
                key={`super-line-${from}-to-${to}`}
                from={topomap.coordinates[from]}
                to={topomap.coordinates[to]}
                stroke="#ffde17"
                strokeWidth={2.5}
                strokeLinecap="round"
              />
          ))}

          {topomap.nodes.map(({ name, markerOffset, type }) => (
            <Marker
              key={name}
              coordinates={topomap.coordinates[name]}
              onMouseEnter={() => { props.onChange(name); }}
            >
              <circle
                r={type === "edge" ? 1.5 : 3} 
                fill={ checkStatus(name) === "up" ? "#078ac1" : "#838385"}
                className="hoverable-node"
              />
              <text
                textAnchor="middle"
                y={markerOffset}
                style={
                  type === "edge" ?
                  { fill: "#5D5A6D", fontSize: ".3rem", fontWeight: "400" }:
                  { fill: "#5D5A6D", fontSize: ".35rem", fontWeight: "600" }
                }
              >
                {name}
              </text>
            </Marker>
          ))}
        </ZoomableGroup>
      </ComposableMap>
      <div className="controls mt-1 d-flex justify-content-center">
        <button className="btn btn-sm btn-outline-primary mr-1" onClick={handleZoomIn}>
          <i className="fa fa-plus"></i>
        </button>
        <button className="btn btn-sm btn-outline-primary" onClick={handleZoomOut}>
          <i className="fa fa-minus"></i>
        </button>
      </div>
  </div>
  )
}

export default Topomap;