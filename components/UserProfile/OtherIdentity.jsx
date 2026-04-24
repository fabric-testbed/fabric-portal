import React, { useState } from 'react';
import { default as portalData } from "../../services/portalData.json";
import { Link as LinkIcon, X, HelpCircle, Plus } from "lucide-react";

const identityOptions = ["google_scholar", "orcid", "other"];

function getRegexForType(type) {
  switch (type) {
    case "google_scholar": return /^[a-zA-Z0-9_-]{8,16}$/;
    case "orcid": return /^(\d{4}-){3}\d{3}[\dX]$/;
    case "other": return /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})(\/[^\s]*)?$/;
    default: return /.*/;
  }
}

function parseIdentityStr(id) {
  if (id.type === "google_scholar") {
    return (
      <a href={`https://scholar.google.com/citations?user=${id.identity}`} target="_blank" rel="noreferrer">
        <span className="font-monospace">{`Google Scholar [ID: ${id.identity}]`}</span>
        <LinkIcon size={16} className="ms-2"/>
      </a>
    );
  } else if (id.type === "orcid") {
    return (
      <a href={`https://orcid.org/${id.identity}`} target="_blank" rel="noreferrer">
        <span className="font-monospace">{`ORCID [ID: ${id.identity}]`}</span>
        <LinkIcon size={16} className="ms-2"/>
      </a>
    );
  } else {
    return (
      <a href={id.identity} target="_blank" rel="noreferrer">
        <span className="font-monospace">{`Other [Link: ${id.identity}]`}</span>
        <LinkIcon size={16} className="ms-2"/>
      </a>
    );
  }
}

function getAlertMessage(type) {
  if (type === "google_scholar") {
    return "Please check your input. A Google Scholar ID consists of a string of alphanumeric characters, typically 12 characters long.";
  } else if (type === "orcid") {
    return "Please check your input. ORCID IDs consist of 16 digits grouped into four blocks separated by hyphens.";
  } else {
    return "Please input a valid website URL.";
  }
}

function OtherIdentity({ other_identities, onIdentityUpdate }) {
  const [type, setType] = useState("");
  const [identity, setIdentity] = useState("");
  const [isValid, setIsValid] = useState(true);

  const handleTypeChange = (e) => {
    const newType = e.target.value;
    setType(newType);
    if (identity !== "") {
      setIsValid(getRegexForType(newType).test(identity));
    }
  };

  const handleIdentityChange = (e) => {
    const newIdentity = e.target.value;
    setIdentity(newIdentity);
    setIsValid(getRegexForType(type).test(newIdentity));
  };

  const handleIdentityAdd = () => {
    onIdentityUpdate("add", { type, identity });
    setType("");
    setIdentity("");
  };

  return (
    <div>
      <h5 className="mt-2">
        Other Identities
        <a href={portalData.learnArticles.guideToOtherIdentities} target="_blank" rel="noreferrer">
          <HelpCircle className="mx-2" size={16} />
          User Guide
        </a>
      </h5>
      <div className="form-row ps-1">
        <div className="form-group slice-builder-form-group w-25 me-2">
          <label htmlFor="inputtype" className="slice-builder-label">Type</label>
          <select
            className="form-control form-control-sm"
            id="typeSelect"
            value={type}
            onChange={handleTypeChange}
          >
            <option value="">Choose...</option>
            {identityOptions.map((t, index) => (
              <option value={t} key={`type-${index}`}>{t}</option>
            ))}
          </select>
        </div>
        <div className="form-group slice-builder-form-group w-50 me-2">
          <label htmlFor="inputIdentity" className="slice-builder-label">Identity</label>
          <input
            type="text" className="form-control form-control-sm" id="inputIdentity"
            value={identity}
            onChange={handleIdentityChange}
          />
        </div>
        <div className="form-group slice-builder-form-group col-md-1">
          <button
            className="btn btn-sm btn-outline-success mt-4"
            type="button"
            onClick={handleIdentityAdd}
            disabled={!isValid}
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
      {!isValid && (
        <div className="alert alert-danger" role="alert">
          {getAlertMessage(type)}
        </div>
      )}
      <ol className="list-group mt-2">
        {other_identities.length > 0 &&
          other_identities.map((id, index) => (
            <li
              className="list-group-item d-flex justify-content-between align-items-center"
              key={`identity-${index}`}
            >
              {parseIdentityStr(id)}
              <button
                className="btn btn-sm btn-outline-success"
                type="button"
                onClick={() => onIdentityUpdate("remove", id)}
              >
                <X size={16} />
              </button>
            </li>
          ))}
      </ol>
    </div>
  );
}

export default OtherIdentity;
