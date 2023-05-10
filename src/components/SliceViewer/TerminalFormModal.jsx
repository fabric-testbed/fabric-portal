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

