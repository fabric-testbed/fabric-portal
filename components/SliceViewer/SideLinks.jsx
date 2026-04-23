import React, { useState } from 'react';
import ServiceTypeTable from './ServiceTypeTable';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import validator from  "@/lib/slices/sliceValidator";
import { default as portalData } from "../../services/portalData.json";
import { HelpCircle, X } from "lucide-react";

const intro = {
  "L2Bridge":{
    "numberOfInterfaces": "Any",
    "numberOfSites": 1,
    "description": "Broadcast service in a single site.",
  },
  "L2PTP": {
    "numberOfInterfaces": 2,
    "numberOfSites": 2,
    "description": "Port-to-Port service between exactly 2 sites.",
  },
  "L2STS": {
    "numberOfInterfaces": "Any",
    "numberOfSites": 2,
    "description": "Site-to-Site service between exactly 2 sites",
  },
  "FABNetv4": {
    "numberOfInterfaces": "Any",
    "numberOfSites": "Any",
    "description": "All interfaces in a given site are part of the same broadcast domain and a single /24 per site using the same gateway. Traffic across sites is routed by FABRIC dataplane.",
  },
  "FABNetv6": {
    "numberOfInterfaces": "Any",
    "numberOfSites": "Any",
    "description": "All interfaces in a given site are part of the same broadcast domain and a single /64 per site using the same gateway. Traffic across sites is routed by FABRIC dataplane.This service also provides the ability to peer with public IPv6 networks.",
  }
};

export default function SideLinks({ onLinkAdd, onCPRemove, selectedCPs, nodes }) {
  const [linkType, setLinkType] = useState("");
  const [linkName, setLinkName] = useState("");

  const handleServiceTypeChange = (e) => {
    setLinkType(e.target.value);
  }

  const handleLinkNameChange = (e) => {
    setLinkName(e.target.value);
  }

  const handleAddLink = () => {
    onLinkAdd(linkType, linkName);
    setLinkType("");
    setLinkName("");
  }

  const raiseRemoveCP = (cp_id) => {
    onCPRemove(cp_id);
  }

  const validationResult = validator.validateNetworkService(linkType, selectedCPs, linkName, nodes);
  const renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  return(
    <div>
      {
        linkType !== "" &&
        <div>
          <div className="mb-1">
            Guide for <span className="fw-bold">{linkType}</span> type Network Service
          </div>
          <ServiceTypeTable service={intro[linkType]} />
        </div>
      }
      <form>
        <div className="form-row mx-1">
          <div className="form-group slice-builder-form-group col-md-6">
            <label htmlFor="inputComponent" className="slice-builder-label">
              Service Type
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 300 }}
                overlay={renderTooltip("network-service-tooltip", portalData.helperText.networkServiceDescription)}
              >
                <HelpCircle className="mx-2 text-secondary" size={16} />
              </OverlayTrigger>
            </label>
            <select
              className="form-control form-control-sm"
              id="componentSelect"
              value={linkType}
              onChange={handleServiceTypeChange}
            >
              <option value="">Choose...</option>
              <option value="L2Bridge">L2Bridge</option>
              <option value="L2PTP">L2PTP</option>
              <option value="L2STS">L2STS</option>
              <option value="FABNetv4">FABNetv4</option>
              <option value="FABNetv6">FABNetv6</option>
            </select>
          </div>
          <div className="form-group slice-builder-form-group col-md-6">
              <label htmlFor="inputNodeName" className="slice-builder-label">Service Name</label>
              <input
                type="text"
                className="form-control form-control-sm"
                id="inputServiceName"
                value={linkName}
                onChange={handleLinkNameChange}
                placeholder={"at least 2 characters..."}
              />
            </div>
          </div>
          {
            selectedCPs.length === 0 &&
            <div className="my-2 sm-alert">
              Click connection points (shown as grey squares) on the topology canvas, then click <b>Select</b> button from the canvas top to add service ports.
            </div>
          }
          <div className="form-row mx-1">
          <div className="form-group slice-builder-form-group mt-2 col-md-12">
            <ul className="input-tag__tags">
              {
                selectedCPs.length > 0 ?
                selectedCPs.map(cp => <li key={`selectedCP${cp.id}`}>
                  {cp.properties.name}
                <X size={14} className="ms-2 cursor-pointer" onClick={() => raiseRemoveCP(cp.id)} />
              </li>) : ""
              }
            </ul>
          </div>
          </div>
      </form>
      {!validationResult.isValid && selectedCPs.length !== 0 &&
        <div className="my-2 sm-alert">
          {validationResult.message}
        </div>
      }
      <div className="my-2 d-flex flex-row">
        <div className="d-flex flex-column text-center me-2">
          <button
            className="btn btn-sm btn-success mb-2"
            disabled={!validationResult.isValid}
            onClick={()=> handleAddLink()}
          >
            Add Service
          </button>
        </div>
      </div>
    </div>
  )
}
