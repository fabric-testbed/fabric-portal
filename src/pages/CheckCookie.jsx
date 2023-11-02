import React, {Component} from "react";
import SpinnerWithText from "../components/common/SpinnerWithText";
import { getCookie } from "../services/cookieService";
import { toast } from "react-toastify";
import CopyButton from "../components/common/CopyButton";
import { default as portalData } from "../services/portalData.json";
import { NavLink } from "react-router-dom";
import { getCookieConsentValue } from "react-cookie-consent";

class CheckCookies extends Component {
  state = {
    cookie: {},
    showSpinner: false,
    copySuccess: false
  }

  async componentDidMount() {
      this.setState({ showSpinner: true });
      try {
        const { data: res } = await getCookie();
        let cookie = res.results[0];
        this.setState({ cookie, showSpinner: false })
      } catch (err) {
        toast.error("Failed to get search results. Please reload this page.");
      }
  }

  handleLogin = () => {
    if (getCookieConsentValue("fabricPortalCookieConsent")) {
      // remove old user status stored in browser.
      localStorage.removeItem("userStatus");
      // nginx handle login url.
      window.location.href = "/login";
    } else {
      toast("Please acknowledge our cookie policy first: click OK on the bottom banner before login.");
    }
  }

  copyCookie = (e) => {
    e.preventDefault();
    document.getElementById(`checkCookieContent`).select();
    document.execCommand('copy');
    e.target.focus();
    this.setState({ copySuccess: true });
  }

  render() {
    const { cookie, showSpinner, copySuccess } = this.state

    return (
      <div className="container">
        <h2 className="text-center">Check Cookie</h2>
        {
          showSpinner && <SpinnerWithText text={"Loading account information..."} />
        }
        {
          (!localStorage.getItem("userStatus") || 
          localStorage.getItem("userStatus") === "unauthorized" ) && 
          <div className="d-flex flex-column align-items-center">
            <div className="alert alert-primary mt-3" role="alert">
              Please login first to authenticate and set the cookie content.
            </div>
            <NavLink to="/login">
              <button
                className="btn btn-outline-primary mt-2"
                onClick={this.handleLogin}
              >
                <i className="fa fa-sign-in mr-2"></i>
                Log In
              </button>
            </NavLink>
          </div>
        }
        {
          localStorage.getItem("userStatus") && localStorage.getItem("userStatus") !== "unauthorized" 
          && !showSpinner && cookie && 
          <div className="d-flex flex-column align-items-center">
            <div className="alert alert-primary mt-3 w-100" role="alert">
              Please copy and paste the cookie information below into the appropriate field in the FABRIC Account Help Portal. It will help us debug the account issues you may be having. 
            </div>
            <table className="table table-striped table-bordered mt-2">
              <tbody>
                <tr>
                  <td>Cookie Name</td>
                  <td>
                    <span className="mr-2">{ cookie.cookie_name }</span>
                  </td>
                </tr>
                {
                  cookie.cookie_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" && 
                  <tr>
                    <td>User Name</td>
                    <td>
                      <span className="mr-2">
                        {cookie.cookie_attributes.name}
                      </span>
                    </td>
                  </tr>
                }
                {
                  cookie.cookie_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>Email</td>
                    <td>
                      <span className="mr-2">{ cookie.cookie_attributes.email }</span>
                    </td>
                  </tr>
                }
                {
                  cookie.cookie_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>CILogon ID</td>
                    <td>
                      <span className="mr-2">{ cookie.cookie_attributes.sub }</span>
                    </td>
                  </tr>
                }
                {
                  cookie.fabric_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>UUID</td>
                    <td>
                      <span className="mr-2">{ cookie.fabric_attributes.uuid }</span>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            <textarea
              className="form-control check-cookie-textarea"
              id="checkCookieContent"
              value={JSON.stringify(cookie, undefined, 4)}
              rows={3}
            />
            {
              copySuccess &&
              <div className="alert alert-success mb-2 w-100" role="alert">
                Cookie successfully copied! Please paste into FABRIC Account Help Portal to create a ticket.
              </div>
            }
            <button
              onClick={e => this.copyCookie(e)}
              className="btn btn-sm btn-outline-primary mr-2 mt-2 mb-4"
            >
              <i className="fa fa-copy mr-2"></i>
              Copy Cookie
            </button>
            <a
              href={portalData.jiraLinks.accountIssue}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-primary"
            >
              <i className="fa fa-sign-in mr-2" />
              FABRIC Account Help Portal
            </a>
          </div>
        }
      </div>
    );
  }
};

export default CheckCookies;