import React from "react";
import { NavLink } from "react-router-dom";
import { toast } from 'react-toastify';
import { getCookieConsentValue } from "react-cookie-consent";
import BackgroundImage from "../../imgs/network-bg.svg";

const LoginRequired = () => {
  
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

  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <img src={BackgroundImage} alt={`static page background`} className="static-page-bg"/>
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-2">{`Please log in first to access this page.`}</h1>
        <NavLink to="/login">
          <button
            className="btn btn-outline-primary mt-5"
            onClick={handleLogin}
          >
            <i className="fa fa-sign-in mr-2"></i>
            Log In
          </button>
        </NavLink>
      </div>
    </div>
  );
};

export default LoginRequired;
