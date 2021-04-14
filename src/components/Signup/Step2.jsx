import React from "react";

const Step2 = () => {
  return (
    <div>
      <div>
        <p>Dear Experimenter,</p>
        <p>Congratulations on completing the first step of the enrollment:</p>
        <ul>
          <li>
            Please check your email (including Spam/Junk) for a confirmation email from FABRIC COmanage. Follow the instructions in the email to confirm your email address by clicking the indicated link.
          </li>
          <li>
            The link will take you back to the COmanage site (you will once again login using CI Logon). Once your email is confirmed <b>you will be redirected back to this site for more instructions.</b>
          </li>
        </ul>
        <p>
        Please note: you will <b>always</b> use your institutional credentials to login to FABRIC portal via your institution's Identity Provider - we <b>do not and will never store your password or login information</b>. Any password changes that you go through with your institutional account will also affect how you login to FABRIC.
        </p>
      </div>
    </div>
  )
}

export default Step2;