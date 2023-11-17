import Joi from "joi-browser";
import checkPortalType from "../../utils/checkPortalType";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import { default as portalData } from "../../services/portalData.json";

class TerminalFormModal extends Form {
  state = {
    data: {
      sliverPrivateKey: "",
      bastionPrivateKey: "",
    },
    sliverTooltip: {
      id: "sliverKeyTooltip",
      content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
    },
    bastionTooltip: {
      id: "bastionKeyTooltip",
      content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
    },
    errors: {},
    showSpinner: false
  }

  doSubmit = () => {
    const { data } = this.state;
    const { vmData } = this.props;
    const domain = "fabric-testbed.net";
    // set cookie first
    const credentials = { 
      'hostname': vmData.properties.MgmtIp,
      'username': portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]],
      'privatekey': data.sliverPrivateKey
    };
    const bastion_credentials = { 
      'hostname': portalData.bastionHostname,
      'username': localStorage.getItem("bastionLogin"),
      'privatekey': data.bastionPrivateKey
    };
    // open a new tab with the web ssh app
    // encode the binary string to base64-encoded data.
    const cred_string = btoa(JSON.stringify(credentials));
    const bast_string = btoa(JSON.stringify(bastion_credentials));
    const now = new Date();
    now.setSeconds(now.getSeconds() + 15);
    document.cookie = `credentials=${cred_string};domain=${domain};SameSite=Strict;path=/`;
    document.cookie = `bastion-credentials=${bast_string};domain=${domain};SameSite=Strict;path=/`;

    this.setState({ showSpinner: true });
  };

  schema = {
    sliverPrivateKey: Joi.string().required().label("Sliver Private Key"),
    bastionPrivateKey: Joi.string().required().label("Bastion Private Key"),
  };

  closeModal = () => {
    // clear modal state.
    const blank_data = {
      sliverPrivateKey: "",
      bastionPrivateKey: "",
    };

    // clear private keys in browser storage after 10 seconds
    setTimeout(() => {
      document.cookie = `credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
      document.cookie = `bastion-credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }, 10000);

    this.setState({ data: blank_data, showSpinner: false });
  }

  clickCloseModalBtn = () => {
    document.getElementById("closeModalBtn").click();
  }

  render() {
    const { sliverTooltip, bastionTooltip, showSpinner } =  this.state;
    const { vmData, ephemeralKey } = this.props;
    return (
    <div className="modal fade" id="TerminalFormModalCenter" tabindex="-1" role="dialog" aria-labelledby="TerminalFormModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title" id="exampleModalLongTitle">Connect to VM</h5>
            <button
              type="button"
              className="close"
              id="closeModalBtn"
              data-dismiss="modal"
              aria-label="Close"
              onClick={this.closeModal}
            >
              <span aria-hidden="true">&times;</span>
            </button>
          </div>
          {
            showSpinner &&
            <div className="modal-body d-flex flex-column align-items-center justify-content-center">
              <SpinnerWithText text={"Connecting to VM..."} />
              <a
                href={portalData.webSshAppLinks[checkPortalType(window.location.href)]}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button
                  className="mt-2 btn btn-sm btn-primary"
                  aria-label="Close"
                  onClick={this.clickCloseModalBtn}
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Open Terminal
                </button>
              </a>
            </div>
          }
          {
            !showSpinner && <div className="modal-body">
            {
              vmData && vmData.properties && <form>
                <div className="row mb-2 mx-1">
                  <label>Hostname</label>
                  <input type="text" className="form-control" defaultValue={vmData.properties.MgmtIp} disabled/>
                </div>
                {
                  vmData.properties.ImageRef && <div className="row mb-2 mx-1">
                    <label>Username</label>
                    <input type="text" className="form-control" defaultValue={portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]]} disabled/>
                  </div>
                }
                <div className="row mb-2 mx-1">
                  <label>Bastion Hostname</label>
                  <input type="text" className="form-control" defaultValue={portalData.bastionHostname} disabled/>
                </div>
                <div className="row mb-2 mx-1">
                  <label>Bastion Username</label>
                  <input type="text" className="form-control" defaultValue={localStorage.getItem("bastionLogin")} disabled/>
                </div>
                <div className="row mb-2 mx-1">
                  <label>Ephemeral Sliver Private Key</label>
                  <textarea type="text" className="form-control" defaultValue={ephemeralKey.private_openssh} disabled />
                </div>
              </form>
            }
            <div className="alert alert-primary mt-2 mb-1" role="alert">
              <i className="fa fa-exclamation-triangle mr-1"></i> 
              Your private keys will only be used to establish connection and will not be stored.
            </div>
            <form onSubmit={this.handleSubmit}>
              {/* {this.renderTextarea("sliverPrivateKey", "Sliver Private Key", true, sliverTooltip)} */}
              {this.renderTextarea("bastionPrivateKey", "Bastion Private Key", true, bastionTooltip)}
              {this.renderButton("Connect")}
            </form>
            </div>
          }
        </div>
    </div>
    </div>
    )
  }
}

export default TerminalFormModal;

