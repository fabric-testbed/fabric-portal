import React from "react";

const Step1 = () => {
  return (
    <div>
      <div>
        <p>Dear Experimenter,</p>
        <p>Welcome to FABRIC! Before you sign up we would like you to familiarize yourself with our facility Acceptable Use Policy (AUP). </p>
        <p>
          In order to begin using FABRIC you will have to take the following steps:
        </p>
        <ul>
          <li>Click ‘Proceed’ and you will be redirected to a <a href="https://www.cilogon.org/" target="_blank">CI Logon</a> page, where you can select your institution and login using your institutional username and password. </li>
          <li>After logging in you will be redirected to an enrollment page in FABRIC’s <a href="https://www.incommon.org/software/comanage/" target="_blank">COmanage</a> which will display your name, email and institution. Please verify those and <b>you will be redirected back to this site for more instructions.</b></li>
        </ul>
        <p>
          Please note: you will <b>always</b> use your institutional credentials to login to FABRIC portal via your institution's Identity Provider - <b>we do not and will never store your password or login information</b>. Any password changes that you go through with your institutional account will also affect how you login to the FABRIC portal.
        </p>
      </div>
      <button className="btn btn-primary mt-2">Proceed</button>
    </div>
  )
}

export default Step1;