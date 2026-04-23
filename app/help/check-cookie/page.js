"use client";

import React, { useState, useEffect, useCallback } from "react";
import SpinnerWithText from "../../../components/common/SpinnerWithText";
import { getCookie } from "../../../services/cookieService";
import { useAuth } from "@/lib/auth/AuthContext";
import { toast } from "react-toastify";
import portalData from "../../../services/portalData.json";
import Link from "next/link";
import { getCookieConsentValue } from "react-cookie-consent";
import { LogIn, Copy } from "lucide-react";

function CheckCookies() {
  const { userStatus } = useAuth();
  const [cookie, setCookie] = useState({});
  const [showSpinner, setShowSpinner] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);

  useEffect(() => {
    async function fetchCookie() {
      setShowSpinner(true);

      try {
        const { data: res } = await getCookie();
        const cookieData = res?.results?.[0] ?? {};
        setCookie(cookieData);
        setShowSpinner(false);
      } catch (err) {
        toast.error("Failed to get search results. Please reload this page.");
        setShowSpinner(false);
      }
    }
    fetchCookie();
  }, []);

  const handleLogin = useCallback(() => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      if (typeof window !== "undefined") {
        window.location.replace("/login?url=" + encodeURIComponent(window.location.origin + "/"));
      }
    } else {
      toast(
        "Please acknowledge our cookie policy first: click OK on the bottom banner before login."
      );
    }
  }, []);

  const copyCookie = useCallback((e) => {
    e.preventDefault();
    const textarea = document.getElementById("checkCookieContent");
    if (textarea) {
      textarea.select();
      document.execCommand("copy");
      e.target.focus();
      setCopySuccess(true);
    }
  }, []);

  const isUnauthorized =
    !userStatus || userStatus === "unauthorized";

  const isAuthorized =
    userStatus && userStatus !== "unauthorized";

  return (
    <div className="container">
      <h2 className="text-center">Check Cookie</h2>

      {showSpinner && (
        <SpinnerWithText text="Loading account information..." />
      )}

      {isUnauthorized && (
        <div className="d-flex flex-column align-items-center">
          <div className="alert alert-primary mt-3" role="alert">
            Please login first to authenticate and set the cookie content.
          </div>
          <button
            className="btn btn-outline-primary mt-2"
            onClick={handleLogin}
          >
            <LogIn className="me-2" size={16} />
            Log In
          </button>
        </div>
      )}

      {isAuthorized && !showSpinner && cookie && (
        <div className="d-flex flex-column align-items-center">
          <div className="alert alert-primary mt-3 w-100" role="alert">
            Please copy and paste the cookie information below into the
            appropriate field in the FABRIC Account Help Portal. It will help
            us debug the account issues you may be having.
          </div>

          <table className="table table-striped table-bordered mt-2">
            <tbody>
              <tr>
                <td>Cookie Name</td>
                <td>{cookie.cookie_name}</td>
              </tr>

              {cookie.cookie_attributes &&
                cookie.cookie_name !== "COOKIE_NOT_FOUND" && (
                  <>
                    <tr>
                      <td>User Name</td>
                      <td>{cookie.cookie_attributes.name}</td>
                    </tr>
                    <tr>
                      <td>Email</td>
                      <td>{cookie.cookie_attributes.email}</td>
                    </tr>
                    <tr>
                      <td>CILogon ID</td>
                      <td>{cookie.cookie_attributes.sub}</td>
                    </tr>
                  </>
                )}

              {cookie.fabric_attributes &&
                cookie.cookie_name !== "COOKIE_NOT_FOUND" && (
                  <tr>
                    <td>UUID</td>
                    <td>{cookie.fabric_attributes.uuid}</td>
                  </tr>
                )}
            </tbody>
          </table>

          <textarea
            className="form-control check-cookie-textarea"
            id="checkCookieContent"
            value={JSON.stringify(cookie, null, 4)}
            rows={3}
            readOnly
          />

          {copySuccess && (
            <div className="alert alert-success mb-2 w-100" role="alert">
              Cookie successfully copied! Please paste into FABRIC Account Help
              Portal to create a ticket.
            </div>
          )}

          <button
            onClick={copyCookie}
            className="btn btn-sm btn-outline-primary me-2 mt-2 mb-4"
          >
            <Copy className="me-2" size={16} />
            Copy Cookie
          </button>

          <a
            href={portalData.jiraLinks.accountIssue}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-primary"
          >
            <LogIn className="me-2" size={16} />
            FABRIC Account Help Portal
          </a>
        </div>
      )}
    </div>
  );
}

export default CheckCookies;
