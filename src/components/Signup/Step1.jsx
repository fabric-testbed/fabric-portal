import React from "react";
import { NavLink } from "react-router-dom";
import checkPortalType from "../../utils/checkPortalType";
import { default as portalData } from "../../services/portalData.json";

const Step1 = () => {
  return (
    <div>
      <div>
        <p>Dear Experimenter,</p>
        <p>Welcome to FABRIC! Before you sign up we would like you to familiarize yourself with our facility <NavLink to="/aup">Acceptable Use Policy (AUP)</NavLink>. </p>
        <p>
          In order to begin using FABRIC you will have to take the following steps:
        </p>
        <ul>
          <li>Click the <b>Proceed</b> button below and you will be redirected to a <a href="https://www.cilogon.org/" target="_blank" rel="noreferrer"><b>CI Logon</b></a> page, where you can select your institution and login using your <i>institutional username and password</i>. </li>
          <li>After logging in you will be redirected to an enrollment page in FABRIC's <a href="https://www.incommon.org/software/comanage/" target="_blank" rel="noreferrer"><b>COmanage</b></a> which will display your name, email and institution. Please verify those and <b>you will be redirected back to this site for more instructions.</b></li>
        </ul>
        <p>
          Please note: you will <b>always</b> use your institutional credentials to login to FABRIC portal via your institution's Identity Provider - <b>we do not and will never store your password or login information</b>. Any password changes that you go through with your institutional account will also affect how you login to the FABRIC portal.
        </p>
      </div>
      <div className="text-center">
      <div className="alert alert-warning" role="alert">
      <i className="fa fa-exclamation-triangle mr-2"></i> Before choosing ORCID, Google, Microsoft or GitHub from the list in CILogon page, <b>please try to find your home institution first</b>. Selecting one of these four providers requires additional human-in-the-loop assistance and review and will delay your registration.
      <br></br>
      (<b>Note</b>: depending on the speed of your Internet connection the list may take a moment to populate beyond the default ORCID).
      </div>
        <a href={portalData.selfEnrollRequest.links[checkPortalType(window.location.href)]}>
          <button
            className="btn btn-primary mt-2"
          >
            Proceed to CILogon
          </button>
        </a>
      </div>
    </div>
  )
}

export default Step1;