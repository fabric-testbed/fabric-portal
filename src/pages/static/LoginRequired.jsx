import React from "react";
import { toast } from 'react-toastify';
import { getCookieConsentValue } from "react-cookie-consent";

const handleLogin = () => {
  if (getCookieConsentValue("fabricPortalCookieConsent")) {
    // remove old user status stored in browser.
    localStorage.removeItem("userStatus");
    // nginx handle login url.
    window.location.href = "/login";
  } else {
    toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
  }
}

const LoginRequired = () => {
  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-2">{`Please log in to use full features of FABRIC Portal.`}</h1>
          <button
            className="btn btn-outline-primary mt-4 btn-sm"
            onClick={handleLogin()}
          >
            <i className="fa fa-sign-in mr-2"></i>
            Log In
          </button>
      </div>
    </div>
  );
};

export default LoginRequired;
