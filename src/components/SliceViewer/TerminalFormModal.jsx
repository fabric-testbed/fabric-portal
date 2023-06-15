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
      content: "Placeholder content..."
    },
    bastionTooltip: {
      id: "bastionKeyTooltip",
      content: "Placeholder content..."
    },
    errors: {},
  }

  doSubmit = () => {
    const { data } = this.state;
    const { vmData } = this.props;
    const domain = "beta-5.fabric-testbed.net";
    // set cookie first
    const credentials = { 
      'hostname': vmData.properties.name,
      'username': portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]],
      'privatekey': data.sliverPrivateKey
    };
    const bastion_credentials = { 
      'hostname': vmData.properties.name,
      'username': portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]],
      'privatekey': data.bastionPrivateKey
    };
   // open a new tab with the web ssh app
   const cred_string = Buffer.from(JSON.stringify(credentials), "base64");
   const bast_string = Buffer.from(JSON.stringify(bastion_credentials), "base64");
   const now = new Date();
   now.setSeconds(now.getSeconds() + 15);
   const nowString = now.toUTCString();
   // we want to make sure cookies don't leak - set Strict and expiry date in 15 seconds
  document.cookie = `credentials=${cred_string};domain=${domain};SameSite=Strict; expires=${nowString};`;
  document.cookie = `bastion-credentials=${bast_string};domain=${domain};SameSite=Strict; expires=${nowString}`;
  setTimeout(() => {
    window.open(`https://${domain}`, "_blank");
  }, 5000);
  setTimeout(() => {
    document.cookie = `credentials=nomore; domain=${domain}; SameSite=Strict;`;
    document.cookie = `bastion-credentials=nomore; domain=${domain}; SameSite=Strict;`;
  }, 10000);
  };

  schema = {
    privateKey: Joi.string().required().label("Private Key"),
    bastionPrivateKey: Joi.string().required().label("Bastion Private Key"),
  };


  render() {
    const { data, sliverTooltip, bastionTooltip } =  this.state;
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
          <form>
            <div className="row mb-2">
              <label>VM Name</label>
              <input type="text" className="form-control" defaultValue={vmData.properties.name} disabled/>
            </div>
            <div className="row mb-2">
              <label>Management IP Address</label>
              <input type="text" className="form-control" defaultValue={vmData.properties.MgmtIp} disabled/>
            </div>
            <div className="row mb-2">
              <label>User Name</label>
              <input type="text" className="form-control" defaultValue={portalData.usernameOnImageMapping[vmData.properties.ImageRef.split(",")[0]]} disabled/>
            </div>
          </form>
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

