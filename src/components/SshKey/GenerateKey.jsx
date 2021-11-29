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
    generatedKey: 

    {
      "private_openssh": "-----BEGIN OPENSSH PRIVATE KEY-----\n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\n-----END OPENSSH PRIVATE KEY-----\n",
      "public_openssh": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCr0M3Jzy+TE2SN9+sXsQZReHvno+nERIC0Mgmlt7iPU2PY3oSHP+Y+7fmbDJado+u0We2DBGnBhsLOjyxpfIXJY5COzLMUH6c0yIPYnwo9D9WCTvn1srCLnbkPpeRWEASUUgOcppIo/+oQ028QupvUyIXxpR2NACi/VpMs51u25NK6H4ES/5uP6oGTe5z1slcetkGCb2eUarlFk04rIvvayoJGK5SYtEXOV9xEvuoj4erP+FvaIzDePZ02o9wZD/5QHLpwn0kpqwxcopH+W9vN4e+fLG9bEaj2L9SokbhMCTHsDZoIS37uzxA6/gzdDnsYe3W3i6wQxcXSNO0zVcrORtLMFG9Q/5bCiWmGNN7eXy/fhnJoWlpqxw/f6PFrUTevTuzEhhYXQGIkr+bYL21ab316/Wq2umrYwVp+iRb78CNb9zfQtTBiFOle5T1VG4hCPYgL+JEvFhrp6QUx0zp42+RIwFaw+ktV7rbeY8fKNIVzd2hij04pFpsIck8f5jM= test-key-2"
    }
    ,
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
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true, nameTooltip)}
          {this.renderTextarea("description", "Description", true, descriptionTooltip)}
          {this.renderSelect("keyType", "Key Type", true, "", keyTypes)}
          {this.renderButton("Generate Key Pair")}
        </form>
          <div
            className={`modal ${Object.keys(generatedKey).length === 0 && "fade"}`}
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