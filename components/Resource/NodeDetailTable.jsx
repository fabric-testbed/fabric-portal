import React from 'react';
import { sitesNameMapping } from "../../assets/data/sites";
import Link from "next/link";

const RESOURCE_ROWS_LONG = [
  ["Cores",     "totalCore",      "freeCore"],
  ["Disk (GB)", "totalDisk",      "freeDisk"],
  ["RAM (GB)",  "totalRAM",       "freeRAM"],
  ["GPU",       "totalGPU",       "freeGPU"],
  ["NVME",      "totalNVME",      "freeNVME"],
  ["SmartNIC",  "totalSmartNIC",  "freeSmartNIC"],
  ["SharedNIC", "totalSharedNIC", "freeSharedNIC"],
  ["FPGA",      "totalFPGA",      "freeFPGA"],
  ["Switch",    "totalSwitch",    "freeSwitch"],
];
const RESOURCE_ROWS_SHORT = RESOURCE_ROWS_LONG.slice(0, 3);

const STATUS_BADGE = {
  Active:    { background: "#e6f4f2", color: "#005a4e", border: "1px solid #008e7a", label: "Active" },
  Maint:     { background: "#374955", color: "#ffffff", border: "1px solid #374955", label: "Down" },
  PreMaint:  { background: "#fff3ec", color: "#7a3200", border: "1px solid #ff8542", label: "Pre-Maintenance" },
  PartMaint: { background: "#fff3ec", color: "#7a3200", border: "1px solid #ff8542", label: "Partial Maint" },
};

function StatusBadge({ state }) {
  const s = STATUS_BADGE[state] || STATUS_BADGE.Active;
  return (
    <span style={{ ...s, padding: "0.1rem 0.45rem", fontSize: "0.65rem", fontWeight: 700, borderRadius: "0.25rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>
      {s.label}
    </span>
  );
}

function ResourceBar({ free, total }) {
  const pct = total > 0 ? Math.round((free / total) * 100) : 0;
  return (
    <div style={{ position: "relative", height: "1.5rem", borderRadius: "0.25rem", background: "#e9ecef", overflow: "hidden" }}>
      {total > 0 && (
        <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, background: "#5798bc", width: `${Math.min(pct, 100)}%`, borderRadius: "0.25rem", transition: "width 150ms" }} />
      )}
      <span style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.72rem", fontFamily: "monospace", color: "#374955", whiteSpace: "nowrap" }}>
        {free}/{total}
      </span>
    </div>
  );
}

const DEV_SITES = new Set(["LBNL", "UKY", "RENC"]);

const NodeDetailTable = ({ name, resource, parent }) => {
  const isSitePage = parent === "sitepage";
  const rows = isSitePage ? RESOURCE_ROWS_SHORT : RESOURCE_ROWS_LONG;

  const acronym = isSitePage
    ? name
    : (sitesNameMapping.shortNameToAcronym[name] || name.toUpperCase());
  const longName = isSitePage
    ? (sitesNameMapping.acronymToLongName[name] || name)
    : (sitesNameMapping.shortToLongName[name] || name);

  const isDown = resource?.status?.state === "Maint";
  const isDevSite = DEV_SITES.has(acronym);

  return (
    <div style={{ borderRadius: "0.75rem", border: "1px solid #a8c9dc", background: "white", display: "flex", flexDirection: "column", overflow: "hidden", height: "100%" }}>
      {/* Header */}
      <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid #a8c9dc" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap" }}>
          {resource && !isSitePage ? (
            <Link href={`/resources/sites/${resource.name}`} style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1f6a8c", textTransform: "uppercase", letterSpacing: "0.05em", textDecoration: "none" }}>
              {acronym}
            </Link>
          ) : (
            <span style={{ fontSize: "0.9rem", fontWeight: 700, color: "#1f6a8c", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {acronym}
            </span>
          )}
          {resource ? <StatusBadge state={resource.status.state} /> : <StatusBadge state="Maint" />}
        </div>
        <p style={{ fontSize: "0.78rem", color: "#838385", marginTop: "0.25rem", marginBottom: 0, lineHeight: 1.3 }}>
          {longName}
        </p>
      </div>

      {/* Body */}
      <div style={{ flex: 1, overflowY: "auto" }}>
        {(!resource || isDown) ? (
          <div style={{ padding: "0.75rem 1rem" }}>
            {isDevSite && (
              <p style={{ fontSize: "0.85rem", color: "#838385", margin: 0, lineHeight: 1.4 }}>
                This is a development site and not available for general use.
              </p>
            )}
          </div>
        ) : (
          <div style={{ padding: "0.5rem 0.75rem", display: "grid", gridTemplateColumns: "auto 1fr", columnGap: "0.75rem" }}>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#838385", textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: "0.375rem" }}>Resource</div>
            <div style={{ fontSize: "0.68rem", fontWeight: 600, color: "#838385", textTransform: "uppercase", letterSpacing: "0.05em", paddingBottom: "0.375rem", textAlign: "right" }}>Available / Total</div>
            {rows.map(([label, totalKey, freeKey]) => (
              <React.Fragment key={label}>
                <div style={{ fontSize: "0.8rem", color: "#374955", padding: "0.35rem 0", alignSelf: "center" }}>{label}</div>
                <div style={{ padding: "0.35rem 0", alignSelf: "center" }}>
                  <ResourceBar free={resource[freeKey]} total={resource[totalKey]} />
                </div>
              </React.Fragment>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default NodeDetailTable;
