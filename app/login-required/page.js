"use client";
import { getCookieConsentValue } from "react-cookie-consent";
import { toast } from "react-toastify";
import { clearSession } from "@/utils/sessionCookies";
import { LogIn } from "lucide-react";

export default function LoginRequired() {
  const handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      clearSession();
      window.location.href = "/login?url=" + encodeURIComponent(window.location.origin + "/");
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  };

  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <img src="/imgs/network-bg.svg" alt="background" className="static-page-bg" />
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-2">Please log in first to access this page.</h1>
        <button
          className="btn btn-outline-primary mt-5"
          onClick={handleLogin}
        >
          <LogIn className="me-2" size={16} />
          Log In
        </button>
      </div>
    </div>
  );
}
