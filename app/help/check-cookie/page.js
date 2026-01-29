"use client";

import React, { Component } from "react";
import SpinnerWithText from "../../../components/common/SpinnerWithText";
import { getCookie } from "../../../services/cookieService";
import { toast } from "react-toastify";
import portalData from "../../../services/portalData.json";
import Link from "next/link";
import { getCookieConsentValue } from "react-cookie-consent";

class CheckCookies extends Component {
  state = {
    cookie: {},
    showSpinner: false,
    copySuccess: false,
    userStatus: null
  };

  async componentDidMount() {
    const userStatus =
      typeof window !== "undefined"
        ? localStorage.getItem("userStatus")
        : null;

    this.setState({ showSpinner: true, userStatus });

    try {
      const { data: res } = await getCookie();
      const cookie = res?.results?.[0] ?? {};
      this.setState({ cookie, showSpinner: false });
    } catch (err) {
      toast.error("Failed to get search results. Please reload this page.");
      this.setState({ showSpinner: false });
    }
  }

  handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("userStatus");
        window.location.href = "/login";
      }
    } else {
      toast(
        "Please acknowledge our cookie policy first: click OK on the bottom banner before login."
      );
    }
  };

  copyCookie = (e) => {
    e.preventDefault();
    const textarea = document.getElementById("checkCookieContent");
    if (textarea) {
      textarea.select();
      document.execCommand("copy");
      e.target.focus();
      this.setState({ copySuccess: true });
    }
  };

  render() {
    const { cookie, showSpinner, copySuccess, userStatus } = this.state;

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
            <Link href="/login">
              <button
                className="btn btn-outline-primary mt-2"
                onClick={this.handleLogin}
              >
                <i className="fa fa-sign-in me-2"></i>
                Log In
              </button>
            </Link>
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
              onClick={this.copyCookie}
              className="btn btn-sm btn-outline-primary me-2 mt-2 mb-4"
            >
              <i className="fa fa-copy me-2"></i>
              Copy Cookie
            </button>

            <a
              href={portalData.jiraLinks.accountIssue}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fa fa-sign-in me-2" />
              FABRIC Account Help Portal
            </a>
          </div>
        )}
      </div>
    );
  }
}

export default CheckCookies;
