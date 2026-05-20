"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import ReactModal from "../components/common/ReactModal";
import FacilityUpdates from "../components/Home/FacilityUpdates";
import HomepageCarousel from "../components/Home/HomepageCarousel.jsx";
import DynamicMetrics from "../components/Home/DynamicMetrics";
import CapabilityIcons from "../components/Home/CapabilityIcons";
import Partners from "../components/Home/Partners";
import { default as portalData } from "../services/portalData.json";
import { sitesNameMapping }  from "../assets/data/sites";
import sitesParser from "../services/parser/sitesParser";
import CookieConsent from "react-cookie-consent";
import dynamic from "next/dynamic";
import Topomap from "../components/Resource/Topomap";
import NodeDetailTable from "../components/Resource/NodeDetailTable";
import { getResources } from "../services/resourceService.js";
import checkPortalType from "@/lib/permissions/checkPortalType";
// import { getLinksData } from "../services/mockLinkData.js";
// import linksParser from "../services/parser/linksParser";
import LinkDetailTable from "../components/Resource/LinkDetailTable.jsx";
import Link from "next/link";

function Home() {
  const { userStatus } = useAuth();
  const [resources, setResources] = useState([]);
  const [activeDetailName, setActiveDetailName] = useState("StarLight");
  const [activeFrom, setActiveFrom] = useState("");
  const [activeTo, setActiveTo] = useState("");
  const [linkData, setLinkData] = useState({});
  const [siteNames, setSiteNames] = useState([]);
  const [siteColorMapping, setSiteColorMapping] = useState({});

  useEffect(() => {
    async function fetchResources() {
      try {
        const { data: res } = await getResources(1, null, null, "sites");
        const parsedObj = sitesParser(res.data[0], sitesNameMapping.acronymToShortName);
        setResources(parsedObj.parsedSites);
        setSiteNames(parsedObj.siteNames);
        setSiteColorMapping(parsedObj.siteColorMapping);
      } catch (err) {
        // Silent failure — resources API requires auth in some environments
      }
    }
    fetchResources();
  }, []);

  const getResourceByName = useCallback((resources, name) => {
    const resource = resources.find(resource => resource.name === name);
    return resource ? resource : null;
  }, []);

  const handleActiveDetailChange = useCallback((name) => {
    setActiveDetailName(name);
  }, []);

  // const handleLinkDetailChange = (from, to) => {
  //   const data = linksParser(getLinksData(), from, to);
  //   setActiveDetailName("");
  //   setActiveFrom(from);
  //   setActiveTo(to);
  //   setLinkData(data);
  // }

  return (
    <div className="home-container">
      {
        userStatus === "inactive" &&
        <div className="self-enroll-container">
          <ReactModal
            id={portalData.selfEnrollRequest.id}
            title={portalData.selfEnrollRequest.title}
            link={portalData.selfEnrollRequest.links[checkPortalType(window.location.href)]}
            content={portalData.selfEnrollRequest.content}
          />
        </div>
      }
      <HomepageCarousel />
      <div className="home-colored-bg">
        <DynamicMetrics />
      </div>
      <div className="home-lower row my-5 align-items-stretch">
        <div className="col-xl-9 col-lg-12">
          <div className="card homepage-card my-4">
            <div className="card-header text-center bg-primary-light">
              <b>Resources</b>
            </div>
            <div className="card-body">
              <Topomap
                onNodeChange={handleActiveDetailChange}
                sites={siteNames}
                siteColorMapping={siteColorMapping}
                mapHeight={430}
              />
              {activeDetailName !== "" && (() => {
                const resource = getResourceByName(resources, sitesNameMapping.shortNameToAcronym[activeDetailName]);
                const acronym = sitesNameMapping.shortNameToAcronym[activeDetailName] || activeDetailName.toUpperCase();
                const isDown = !resource || resource.status?.state === "Maint";
                const DEV_SITES = new Set(["LBNL", "UKY", "RENC"]);
                const isDevSite = DEV_SITES.has(acronym);
                const cols = [
                  { label: "Cores",     fk: "freeCore",      tk: "totalCore"      },
                  { label: "Disk (GB)", fk: "freeDisk",      tk: "totalDisk"      },
                  { label: "RAM (GB)",  fk: "freeRAM",       tk: "totalRAM"       },
                  { label: "GPU",       fk: "freeGPU",       tk: "totalGPU"       },
                  { label: "NVME",      fk: "freeNVME",      tk: "totalNVME"      },
                  { label: "SmartNIC",  fk: "freeSmartNIC",  tk: "totalSmartNIC"  },
                  { label: "SharedNIC", fk: "freeSharedNIC", tk: "totalSharedNIC" },
                  { label: "FPGA",      fk: "freeFPGA",      tk: "totalFPGA"      },
                  { label: "Switch",    fk: "freeSwitch",    tk: "totalSwitch"    },
                ];
                const thStyle = { padding: "0.4rem 0.4rem", fontSize: "0.68rem", fontWeight: 600, color: "#838385", textTransform: "uppercase", letterSpacing: "0.04em", textAlign: "center" };
                return (
                  <div style={{ marginTop: "0.75rem", borderRadius: "0.5rem", border: "1px solid #a8c9dc", overflow: "hidden", background: "white" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse" }}>
                      <thead>
                        <tr style={{ borderBottom: "1px solid #a8c9dc" }}>
                          <th style={{ padding: "0.4rem 0.75rem", fontSize: "0.68rem", fontWeight: 600, color: "#838385", textTransform: "uppercase", letterSpacing: "0.04em" }}>Site</th>
                          {isDown
                            ? <>
                                <th style={thStyle}>Status</th>
                                <th style={thStyle}></th>
                              </>
                            : cols.map(({ label }) => (
                                <th key={label} style={thStyle}>{label}</th>
                              ))
                          }
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: "0.5rem 0.75rem", verticalAlign: "middle" }}>
                            {resource
                              ? <Link href={`/resources/sites/${resource.name}`} style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1f6a8c", textTransform: "uppercase", letterSpacing: "0.04em", textDecoration: "none" }}>{acronym}</Link>
                              : <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "#1f6a8c", textTransform: "uppercase", letterSpacing: "0.04em" }}>{acronym}</span>
                            }
                          </td>
                          {isDown
                            ? <>
                                <td style={{ padding: "0.5rem 0.75rem", verticalAlign: "middle", textAlign: "center" }}>
                                  <span style={{ background: "#374955", color: "white", padding: "0.15rem 0.5rem", fontSize: "0.65rem", fontWeight: 700, borderRadius: "0.25rem", textTransform: "uppercase", letterSpacing: "0.04em" }}>Down</span>
                                </td>
                                <td style={{ padding: "0.5rem 0.75rem", verticalAlign: "middle", textAlign: "right" }}>
                                  {isDevSite && (
                                    <span style={{ fontSize: "0.8rem", color: "#838385", lineHeight: 1.4 }}>
                                      This is a development site and not available for general use.
                                    </span>
                                  )}
                                </td>
                              </>
                            : cols.map(({ label, fk, tk }) => {
                                const free = resource[fk], total = resource[tk];
                                const pct = total > 0 ? Math.round((free / total) * 100) : 0;
                                return (
                                  <td key={label} style={{ padding: "0.5rem 0.4rem", verticalAlign: "middle" }}>
                                    <div style={{ position: "relative", height: "1.4rem", borderRadius: "0.25rem", background: "#e9ecef", overflow: "visible" }}>
                                      {total > 0 && <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, background: "#5798bc", width: `${Math.min(pct, 100)}%`, borderRadius: "0.25rem" }} />}
                                      <span style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", fontSize: "0.62rem", fontFamily: "monospace", color: "#374955", whiteSpace: "nowrap", zIndex: 1 }}>{free}/{total}</span>
                                    </div>
                                  </td>
                                );
                              })
                          }
                        </tr>
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-12" style={{ position: "relative" }}>
          <FacilityUpdates />
        </div>
      </div>
      <div className="home-colored-bg">
        <CapabilityIcons />
      </div>
      <div className="home-lower row mt-2">
        <div className="col-xl-12 col-lg-12">
          <Partners />
        </div>
      </div>
      <CookieConsent
        location="bottom"
        buttonText="OK"
        cookieName="fabricPortalCookieConsent"
      >
        <span className="text-lg">This Website Uses Cookies.</span>
        <div className="mt-1 text-sm">
          We require to use cookies to provide you access to FABRIC testbed resources and to personalize the content of this site. We do not share your personal information with anyone, other than providing anonymous aggregate facility usage statistics to our funders.
          Please accept our Cookie Policy by clicking "OK". For more details, visit the <Link className="text-primary-light" href="/cookie-policy"><b>Cookie Policy Page</b></Link>.
        </div>
      </CookieConsent>
    </div>
  );
}

export default Home;
