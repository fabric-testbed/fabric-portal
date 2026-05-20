import React, { useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
  Line,
  Marker,
} from "react-simple-maps";
import { sitesNameMapping }  from "../../assets/data/sites";
import { topomap } from "../../assets/data/topomap.js";
import { default as geoData } from "../../assets/data/world-countries.json";
import { Plus, Minus, RotateCcw } from "lucide-react";

const zoomBtnStyle = {
  width: "2rem",
  height: "2rem",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "white",
  border: "1px solid #a8c9dc",
  borderRadius: "0.5rem",
  boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  cursor: "pointer",
};

const Topomap = props => {
  const [position, setPosition] = useState({ coordinates: [-95, 36], zoom: 2.5 });
  const [selectedNode, setSelectedNode] = useState("StarLight");

  function handleZoomIn() {
    if (position.zoom >= 8) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom * 1.6 }));
  }

  function handleZoomOut() {
    if (position.zoom <= 1) return;
    setPosition(pos => ({ ...pos, zoom: pos.zoom / 1.6 }));
  }

  function handleMoveEnd(pos) {
    setPosition(pos);
  }

  function handleNodeHover(name) {
    setSelectedNode(name);
    props.onNodeChange(name);
  }

  function getNodeColor(name, type) {
    if (name === selectedNode) return "#008e7a";  // success
    const statusColor = props.siteColorMapping[sitesNameMapping.shortNameToAcronym[name]];
    // Gray out down/unknown sites
    if (!statusColor || statusColor === "#e94948" || statusColor === "#838385") return "#838385";  // secondary
    // Type-based coloring for active sites
    if (type === "us_core") return "#5798bc";  // primary
    return "#1f6a8c";  // primary dark / edge (includes international)
  }

  return (
    <div style={{ position: "relative", borderRadius: "0.75rem", border: "1px solid #a8c9dc", overflow: "hidden", background: "#EAF4FB" }}>
      <ComposableMap
        projection="geoEqualEarth"
        width={800}
        height={props.mapHeight || 360}
        projectionConfig={{ scale: 300, center: [-55, 15] }}
        style={{ width: "100%", height: "auto" }}
      >
        <ZoomableGroup
          zoom={position.zoom}
          center={position.coordinates}
          minZoom={1}
          maxZoom={8}
          onMoveEnd={handleMoveEnd}
        >
          <Geographies geography={geoData} fill="#D6E8F4" stroke="#FFFFFF" strokeWidth={0.4}>
            {({ geographies }) =>
              geographies.map(geo => <Geography key={geo.rsmKey} geography={geo} />)
            }
          </Geographies>

          {topomap.lines.map(({ from, to }) => (
            <Line
              key={`line-${from}-to-${to}`}
              from={topomap.coordinates[from]}
              to={topomap.coordinates[to]}
              stroke="#8ac9ef"
              strokeWidth={0.8}
              strokeLinecap="round"
              strokeOpacity={0.7}
            />
          ))}

          {topomap.usa_lines_super.map(({ from, to }) => (
            <Line
              key={`super-line-${from}-to-${to}`}
              from={topomap.coordinates[from]}
              to={topomap.coordinates[to]}
              stroke="#F5C518"
              strokeWidth={2}
              strokeLinecap="round"
            />
          ))}

          {topomap.international_lines.map(({ from, to }) => (
            <Line
              key={`line-intl-${from}-to-${to}`}
              from={topomap.coordinates[from]}
              to={topomap.coordinates[to]}
              stroke="#8ac9ef"
              strokeWidth={0.8}
              strokeLinecap="round"
              strokeOpacity={0.7}
            />
          ))}

          {topomap.nodes.map(({ name, markerOffset, type }) => {
            const isSelected = name === selectedNode;
            const r = type === "edge" ? 1.8 : 3.2;
            const color = getNodeColor(name, type);
            return (
              <Marker
                key={name}
                coordinates={topomap.coordinates[name]}
                onMouseEnter={() => handleNodeHover(name)}
              >
                <circle r={r * 2.2} fill={color} fillOpacity={isSelected ? 0.25 : 0.15} />
                <circle r={isSelected ? r * 1.4 : r} fill={color} style={{ cursor: "pointer" }} />
                <text
                  textAnchor="middle"
                  y={markerOffset}
                  style={{
                    fill: "#374955",
                    fontSize: type === "edge" ? "0.28rem" : "0.32rem",
                    fontWeight: (isSelected || type === "us_core") ? 700 : 400,
                    fontFamily: "sans-serif",
                    pointerEvents: "none",
                  }}
                >
                  {name}
                </text>
              </Marker>
            );
          })}
        </ZoomableGroup>
      </ComposableMap>

      {/* Zoom controls */}
      <div style={{ position: "absolute", bottom: "1rem", right: "1rem", display: "flex", flexDirection: "column", gap: "0.25rem" }}>
        <button onClick={handleZoomIn} style={zoomBtnStyle}>
          <Plus size={16} color="#374955" />
        </button>
        <button onClick={handleZoomOut} style={zoomBtnStyle}>
          <Minus size={16} color="#374955" />
        </button>
        <button onClick={() => setPosition({ coordinates: [-95, 36], zoom: 2.5 })} style={zoomBtnStyle} title="Reset view">
          <RotateCcw size={14} color="#374955" />
        </button>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", bottom: "1rem", left: "1rem", display: "flex", flexDirection: "column", gap: "0.375rem", background: "rgba(255,255,255,0.85)", backdropFilter: "blur(4px)", borderRadius: "0.5rem", padding: "0.5rem 0.75rem", border: "1px solid #a8c9dc", fontSize: "0.72rem", color: "#374955" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "1.5rem", height: "2px", background: "#F5C518" }} />
          <span>Super Core</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "1.5rem", height: "2px", background: "#8ac9ef", opacity: 0.7 }} />
          <span>L1/L2 Links</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#5798bc" }} />
          <span>Core site</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <span style={{ display: "inline-block", width: "0.5rem", height: "0.5rem", borderRadius: "50%", background: "#1f6a8c" }} />
          <span>Edge site</span>
        </div>
      </div>
    </div>
  );
}

export default Topomap;