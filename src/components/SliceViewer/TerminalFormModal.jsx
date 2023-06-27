import Joi from "joi-browser";
import Form from "../common/Form/Form";
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
      'hostname': "bastion.fabric-testbed.net",
      'username': localStorage.getItem("bastionLogin"),
      'privatekey': data.bastionPrivateKey
    };
   // open a new tab with the web ssh app
   const cred_string = JSON.stringify(credentials);
   const bast_string = JSON.stringify(bastion_credentials);
   const now = new Date();
   now.setSeconds(now.getSeconds() + 15);
   const nowString = now.toUTCString();
   console.log("set cookie:");
   console.log(`credentials=${cred_string};domain=${domain};SameSite=Strict; expires=${nowString};`);
   console.log(`bastion-credentials=${bast_string};domain=${domain};SameSite=Strict; expires=${nowString}`);
   // we want to make sure cookies don't leak - set Strict and expiry date in 15 seconds
  document.cookie = `credentials=${cred_string};domain=${domain};SameSite=Strict; expires=${nowString};`;
  document.cookie = `bastion-credentials=${bast_string};domain=${domain};SameSite=Strict; expires=${nowString}`;

  window.open(`https://beta-5.fabric-testbed.net/`, "_blank");
  // setTimeout(() => {
  //   window.open(`https://beta-5.fabric-testbed.net/`, "_blank");
  // }, 5000);
  // setTimeout(() => {
  //   document.cookie = `credentials=nomore; domain=${domain}; SameSite=Strict;`;
  //   document.cookie = `bastion-credentials=nomore; domain=${domain}; SameSite=Strict;`;
  // }, 10000);
  };

  schema = {
    sliverPrivateKey: Joi.string().required().label("Sliver Private Key"),
    bastionPrivateKey: Joi.string().required().label("Bastion Private Key"),
  };

  render() {
    const { sliverTooltip, bastionTooltip } =  this.state;
    const { vmData } = this.props;
    return (
    <div className="modal fade" id="TerminalFormModalCenter" tabindex="-1" role="dialog" aria-labelledby="TerminalFormModalCenterTitle" aria-hidden="true">
    <div className="modal-dialog modal-dialog-centered" role="document">
      <div className="modal-content">
        <div className="modal-header">
          <h5 className="modal-title" id="exampleModalLongTitle">Connect to VM</h5>
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div className="modal-body">
          {
            vmData && vmData.properties && <form>
              <div className="row mb-2 mx-1">
                <label>VM Name</label>
                <input type="text" className="form-control" defaultValue={vmData.properties.name} disabled/>
              </div>
              <div className="row mb-2 mx-1">
                <label>Management IP Address</label>
                <input type="text" className="form-control" defaultValue={vmData.properties.MgmtIp} disabled/>
              </div>
              {
                vmData.properties.ImageRef && <div className="row mb-2 mx-1">
                  <label>User Name</label>
                  <input type="text" className="form-control" defaultValue={portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]]} disabled/>
                </div>
              }
            </form>
          }
        <form onSubmit={this.handleSubmit}>
          {this.renderTextarea("sliverPrivateKey", "Sliver Private Key", true, sliverTooltip)}
          {this.renderTextarea("bastionPrivateKey", "Bastion Private Key", true, bastionTooltip)}
          {this.renderButton("Connect")}
        </form>
        </div>
      </div>
    </div>
    </div>
    )
  }
}

export default TerminalFormModal;

