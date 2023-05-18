import React from "react";
import checkPortalType from "../../utils/checkPortalType";
import { default as portalData } from "../../services/portalData.json";

const DenyEnrollment = () => {
  return (
    <div>
      <div>
        <p>Dear Experimenter,</p>
        <p>FABRIC does not support GitHub, Google, Microsoft or ORCID as an identity provider for enrollment at this time.</p>
        <p>
          If your institution is not supported in the list of Identity Providers supported by CILogon you may initiate a petition to be added <a href={portalData.jiraLinks["initiateAccountPetition"]} target="_blank" rel="noreferrer">
          using a non-institutional Identity Provider</a>.
        </p>
      </div>
      <div className="text-center">
      <div className="alert alert-warning" role="alert">
        <i className="fa fa-exclamation-triangle mr-2"></i> Please note that the FABRIC team works standard business hours in US Eastern timezone. We generally do not handle requests on weekends or during holidays.
      </div>
      <div className="alert alert-warning" role="alert">
        <i className="fa fa-exclamation-triangle mr-2"></i>
        Please also note that this portal is dedicated to provide solutions for a small number of well-defined problems. For all experiment-related issues, please check the available <a href={portalData.knowledgeBaseLink} target="_blank" rel="noreferrer">
          documentation and ask questions on user forums</a> first!
      </div>
        <a href={portalData.jiraLinks["initiateAccountPetition"]}>
          <button
            className="btn btn-primary mt-2"
          >
            Initiate Petition
          </button>
        </a>
      </div>
    </div>
  )
}

export default DenyEnrollment;