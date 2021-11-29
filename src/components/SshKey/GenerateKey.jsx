import Joi from "joi-browser";
import Form from "../common/Form";

import { generateKeyPairs } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class GenerateKey extends Form {
  state = {
    data: {
      name: "",
      description: "",
      keyType: "",
    },
    keyTypes: [
      { "_id": 1, "name": "sliver" },
      { "_id": 2, "name": "bastion" }
    ],
    errors: {},
    nameTooltip: {
      id: "nameTooltip",
      content: "A single word without space; length between 5 to 100 characters; Could contain -, ., _, (, ),and @."
    },
    descriptionTooltip: {
      id: "descriptionTooltip",
      content: "Length between 5 to 255 characters."
    },
    generatedKey: {},
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      const key = await generateKeyPairs(data.keyType, data.name, data.description);
      this.setState({ generatedKey: key });
    }
    catch (ex) {
      console.log("failed to generate ssh key pairs: " + ex.response.data);
      toast.error("Failed to generate ssh key pairs.");
    }
  };

  schema = {
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  render() {
    const { keyTypes, nameTooltip, descriptionTooltip, generatedKey } =  this.state;
    return (
      <div className="w-100">
        { generatedKey!==null && <span> {generatedKey.comment} - Key Successfully Generated.</span> }
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true, nameTooltip)}
          {this.renderTextarea("description", "Description", true, descriptionTooltip)}
          {this.renderSelect("keyType", "Key Type", true, "", keyTypes)}
          {this.renderButton("Generate Key Pair")}
        </form>
          <div
            className={`modal ${generatedKey === {} && "fade"}`}
            id={"generatedKeyModal"}
            data-backdrop="static"
            data-keyboard="false"
            tabIndex="-1"
            role="dialog"
            aria-labelledby={"generatedKeyModal-title"}
            aria-hidden="true"
          >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Generated Key Pair
                </h5>
                <button className="btn btn-sm btn-outline-secondary" data-dismiss="modal" aria-label="Close">
                  <i className="fa fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <li>
                  Public Key: <a href="#">your_key_name.pub</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <li className="my-4">
                  Private Key: <a href="#">your_key_name</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  The private key will be no longer accessible through the portal once you closed this window.
                  Please download and keep your private keys safe.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default GenerateKey;