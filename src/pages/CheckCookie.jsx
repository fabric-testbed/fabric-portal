import React, {Component} from "react";
import SpinnerWithText from "../components/common/SpinnerWithText";
import { getCookie } from "../services/cookieService";
import { toast } from "react-toastify";
import CopyButton from "../components/common/CopyButton";

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
        <h1>Accound Information</h1>
        {
          showSpinner && <SpinnerWithText text={"Loading account information..."} />
        }
        {
          cookie && 
          <div>
            <table className="table table-striped table-bordered mt-4">
              <tbody>
                <tr>
                  <td>Cookie Name</td>
                  <td>
                    <span className="mr-2">{ cookie.cookie_name }</span>
                    <CopyButton
                      id={cookie.cookie_name}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary"}
                    />
                  </td>
                </tr>
                <tr>
                  <td>User Name</td>
                  <td>
                    <span className="mr-2">
                      { cookie.cookie_attributes.name }
                    </span>
                    <CopyButton
                      id={cookie.cookie_attributes.name}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary"}
                    />
                  </td>
                </tr>
                <tr>
                  <td>Email</td>
                  <td>
                    <span className="mr-2">{ cookie.cookie_attributes.email }</span>
                    <CopyButton
                      id={cookie.cookie_attributes.email}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary"}
                    />
                  </td>
                </tr>
                <tr>
                  <td>CILogon ID</td>
                  <td>
                    <span className="mr-2">{ cookie.cookie_attributes.sub }</span>
                    <CopyButton
                      id={cookie.cookie_attributes.sub}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary"}
                    />
                  </td>
                </tr>
                <tr>
                  <td>UUID</td>
                  <td>
                    <span className="mr-2">{ cookie.fabric_attributes.uuid }</span>
                    <CopyButton
                      id={cookie.fabric_attributes.uuid}
                      text=""
                      showCopiedValue={true}
                      btnStyle={"btn btn-sm btn-primary"}
                    />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        }
      </div>
    );
  }
};

export default CheckCookies;