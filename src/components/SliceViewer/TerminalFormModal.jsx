import Joi from "joi-browser";
import checkPortalType from "../../utils/checkPortalType";
import Form from "../common/Form/Form";
import SpinnerWithText from "../common/SpinnerWithText";
import { default as portalData } from "../../services/portalData.json";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class TerminalFormModal extends Form {
  state = {
    sliverPrivateKey: "",
    bastionPrivateKey: "",
    sliverTooltip: {
      id: "sliverKeyTooltip",
      content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
    },
    bastionTooltip: {
      id: "bastionKeyTooltip",
      content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
    },
    errors: {},
    showSpinner: false,
    // unselected, copied, ephemeral
    keySelectStatus: "unselected"
  }

  doSubmit = () => {
    const { sliverPrivateKey, bastionPrivateKey } = this.state;
    const { vmData, ephemeralKey  } = this.props;
    const domain = "fabric-testbed.net";
    // set cookie first
    const credentials = { 
      'hostname': vmData.properties.MgmtIp,
      'username': portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]],
      'privatekey': sliverPrivateKey ? sliverPrivateKey : ephemeralKey.private_openssh
    };
    const bastion_credentials = { 
      'hostname': portalData.bastionHostname,
      'username': localStorage.getItem("bastionLogin"),
      'privatekey': bastionPrivateKey
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
    // clear private keys in browser storage after 10 seconds
    setTimeout(() => {
      document.cookie = `credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
      document.cookie = `bastion-credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }, 10000);

    this.setState({
      sliverPrivateKey: "",
      bastionPrivateKey: "", 
      showSpinner: false });
  }

  clickCloseModalBtn = () => {
    document.getElementById("closeModalBtn").click();
  }

  handleInputChange = (e) => {
    this.setState({ keySelectStatus: e.target.value });
  }

  handleSliverKeyChange = (e) => {
    this.setState({ sliverPrivateKey: e.target.value });
  }

  handleBastionKeyChange = (e) => {
    this.setState({ bastionPrivateKey: e.target.value });
  }

  render() {
    const { showSpinner, keySelectStatus, sliverPrivateKey, bastionPrivateKey, sliverTooltip, bastionTooltip } =  this.state;
    const { vmData, ephemeralKey } = this.props;

    const renderTooltip = (id, content) => (
      <Tooltip id={id}>
        {content}
      </Tooltip>
    );

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
              vmData && vmData.properties && <form onSubmit={this.handleSubmit}>
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
                <div className="alert alert-primary mt-2 mb-1" role="alert">
                  <i className="fa fa-exclamation-triangle mr-1"></i> 
                  Your private keys will only be used to establish connection and will not be stored.
                </div>
                <div className="row mx-1 mt-2">
                  <label>Please choose</label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="keyRadios"
                    id="keyRadios1"
                    value="copied"
                    checked={keySelectStatus==="copied"}
                    onChange={(e) => this.handleInputChange(e)}
                  />
                  <label className="form-check-label" for="keyRadios1">
                    Input Sliver Private Key
                  </label>
                </div>
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="keyRadios"
                    id="keyRadios2"
                    value="ephemeral"
                    checked={keySelectStatus==="ephemeral"}
                    onChange={(e) => this.handleInputChange(e)}
                    onClick={() => this.props.onGenerateEphemeralKey()}
                  />
                  <label className="form-check-label" for="keyRadios2">
                    Generate and Install Ephemeral Key
                  </label>
                </div>
                {
                  keySelectStatus === "copied" &&
                  <div className="row mb-2 mx-1">
                    <label>Sliver Private Key 
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip(sliverTooltip.id, sliverTooltip.content)}
                      >
                        <i className="fa fa-question-circle text-secondary ml-2"></i>
                      </OverlayTrigger>
                    </label> 
                    <textarea
                      type="text"
                      className="form-control"
                      value={sliverPrivateKey}
                      onChange={(e) => this.handleSliverKeyChange(e)}
                    />
                  </div>
                }
                {
                  keySelectStatus === "ephemeral" &&
                  <div className="row mb-2 mx-1">
                    <label>Ephemeral Sliver Private Key</label>
                    <textarea type="text" className="form-control" defaultValue={ephemeralKey.private_openssh} disabled />
                  </div>
                }
                <div className="row mb-2 mx-1">
                  <label>
                    Bastion Private Key
                      <OverlayTrigger
                        placement="right"
                        delay={{ show: 100, hide: 300 }}
                        overlay={renderTooltip(bastionTooltip.id, bastionTooltip.content)}
                      >
                        <i className="fa fa-question-circle text-secondary ml-2"></i>
                      </OverlayTrigger>
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={bastionPrivateKey}
                    onChange={(e) => this.handleBastionKeyChange(e)}
                  />
                </div>
                <button className="btn btn-primary">
                  Connect
                </button>
              </form>
            }
            </div>
          }
        </div>
    </div>
    </div>
    )
  }
}

export default TerminalFormModal;

