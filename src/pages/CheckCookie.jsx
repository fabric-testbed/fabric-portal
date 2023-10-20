import React, {Component} from "react";
import SpinnerWithText from "../components/common/SpinnerWithText";
import { getCookie } from "../services/cookieService";
import { toast } from "react-toastify";
import CopyButton from "../components/common/CopyButton";
import { default as portalData } from "../services/portalData.json";

class CheckCookies extends Component {
  state = {
    cookie: {},
    showSpinner: false,
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

  render() {
    const { cookie, showSpinner } = this.state

    return (
      <div className="container">
        <h2>Check Account Information via Cookie</h2>
        <div className="alert alert-primary mt-3" role="alert">
          Please copy and paste the useful account information into the FABRIC Account Help Portal issue
          regarding Sign up, Log in, or other account related status questions.
        </div>
        {
          showSpinner && <SpinnerWithText text={"Loading account information..."} />
        }
        {
          !showSpinner && cookie && 
          <div className="d-flex flex-column align-items-center">
            <table className="table table-striped table-bordered mt-2">
              <tbody>
                <tr>
                  <td>Cookie Name</td>
                  <td>
                    <span className="mr-2">{ cookie.cookie_name }</span>
                    <CopyButton
                      id={cookie.cookie_name}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary ml-3"}
                    />
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
                      <CopyButton
                        id={cookie.cookie_attributes.name}
                        text=""
                        showCopiedValue={true}
                        btnStyle={"btn btn-sm btn-primary ml-3"}
                      />
                    </td>
                  </tr>
                }
                {
                  cookie.cookie_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>Email</td>
                    <td>
                      <span className="mr-2">{ cookie.cookie_attributes.email }</span>
                      <CopyButton
                        id={cookie.cookie_attributes.email}
                        text=""
                        showCopiedValue={true}
                        btnStyle={"btn btn-sm btn-primary ml-3"}
                      />
                    </td>
                  </tr>
                }
                {
                  cookie.cookie_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>CILogon ID</td>
                    <td>
                      <span className="mr-2">{ cookie.cookie_attributes.sub }</span>
                      <CopyButton
                        id={cookie.cookie_attributes.sub}
                        text=""
                        showCopiedValue={true}
                        btnStyle={"btn btn-sm btn-primary ml-3"}
                      />
                    </td>
                  </tr>
                }
                {
                  cookie.fabric_attributes && cookie.cookie_name !== "COOKIE_NOT_FOUND" &&
                  <tr>
                    <td>UUID</td>
                    <td>
                      <span className="mr-2">{ cookie.fabric_attributes.uuid }</span>
                      <CopyButton
                        id={cookie.fabric_attributes.uuid}
                        text=""
                        showCopiedValue={true}
                        btnStyle={"btn btn-sm btn-primary ml-3"}
                      />
                    </td>
                  </tr>
                }
              </tbody>
            </table>
            <a
              href={portalData.jiraLinks.accountIssue}
              target="_blank" rel="noopener noreferrer"
              className="btn btn-outline-primary"
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