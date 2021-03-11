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
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 2 }));
  }

  function handleMoveEnd(position) {
    setPosition(position);
  }

  return (
    <div style={{marginTop: "1rem"}} className="fabric-map">
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
          fill="#cde4ef"
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
            stroke="#27aae1"
            strokeWidth={1}
            strokeLinecap="round"
          />
        ))}

        {topomap.usa_lines_super.map(({ from, to }) => (
            <Line
              key={`super-line-${from}-to-${to}`}
              from={topomap.coordinates[from]}
              to={topomap.coordinates[to]}
              stroke="#ffde17"
              strokeWidth={3}
              strokeLinecap="round"
            />
        ))}

        {topomap.fab_nodes.map(({ name, markerOffset }) => (
          <Marker key={name} coordinates={topomap.coordinates[name]}>
            <circle r={3} fill="#27aae1" />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fill: "#5D5A6D", fontSize: ".45rem", fontWeight: "600" }}
            >
              {name}
            </text>
          </Marker>
        ))}
        
        {topomap.edge_nodes.map(({ name, markerOffset }) => (
          <Marker key={name} coordinates={topomap.coordinates[name]}>
            <circle r={1.5} fill="#27aae1" />
            <text
              textAnchor="middle"
              y={markerOffset}
              style={{ fill: "#5D5A6D", fontSize: ".3rem", fontWeight: "600" }}
            >
              {name}
            </text>
          </Marker>
        ))}
      </ZoomableGroup>
  </ComposableMap>
  <div className="controls">
        <button onClick={handleZoomIn}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
        <button onClick={handleZoomOut}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="3"
          >
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      </div>
 </div>
  )
}

export default Topomap;