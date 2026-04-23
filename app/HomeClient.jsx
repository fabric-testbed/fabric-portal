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
const Chatbot = dynamic(() => import("../components/common/Chatbot"), { ssr: false });
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
        const { data: res } = await getResources(1);
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
      <div className="home-lower row my-5">
        <div className="col-xl-9 col-lg-12">
          <div className="card homepage-card my-4">
            <div className="card-header text-center bg-primary-light">
              <b>Resources</b>
            </div>
            <div className="card-body">
              <div className="row my-2">
                <div className="col-xl-9 col-lg-8 col-sm-12 mb-4">
                  <Topomap
                    onNodeChange={handleActiveDetailChange}
                    // onLinkChange={handleLinkDetailChange}
                    sites={siteNames}
                    siteColorMapping={siteColorMapping}
                  />
                </div>
                <div className="col-xl-3 col-lg-4 col-sm-12">
                  {
                    activeDetailName !== "" &&
                      <NodeDetailTable
                        name={activeDetailName}
                        resource={getResourceByName(resources, sitesNameMapping.shortNameToAcronym[activeDetailName])}
                        parent="homepage"
                      />
                  }
                 {
                    activeFrom !== "" && activeTo !== "" &&
                    <LinkDetailTable
                      from={activeFrom}
                      to={activeTo}
                      data={linkData}
                    />
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-3 col-lg-12">
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
      <Chatbot/>
    </div>
  );
}

export default Home;
