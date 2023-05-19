import React from "react";
import { default as portalData } from "../../services/portalData.json";

const DenyEnrollment = () => {
  return (
    <div>
      <div>
        <p>Dear Experimenter,</p>
        <p>FABRIC does not support GitHub, Google, Microsoft or ORCID as an identity provider for enrollment without a prior agreement.</p>
        <p>
        If your institution is not listed among the Identity Providers supported by CILogon or you are not able to use it for some other reason, you may initiate a petition to be added via a non-institutional Identity Provider, such as GitHub, Google, Microsoft or ORCID. Please note that such petitions undergo manual review - we may request additional information prior to granting access.
        </p>
      </div>
      <div className="text-center">
      <div className="alert alert-warning" role="alert">
        <i className="fa fa-exclamation-triangle mr-2"></i> Please note that the FABRIC team works standard business hours in US Eastern timezone. We generally do not handle requests on weekends or during holidays.
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