import Joi from "joi-browser";
import Form from "../common/Form";

import { uploadPublicKey } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class UploadKey extends Form {
  state = {
    data: {
      publickey: "",
      description: "",
      keyType: "",
    },
    keyTypes: [
      { "_id": 1, "name": "sliver" },
      { "_id": 2, "name": "bastion" }
    ],
    errors: {},
    publickeyTooltip: {
      id: "publicKeyTooltip",
      content: "Uploaded key must be RSA (3072 bits or longer) or ECDSA (256 bits or longer)."
    },
    descriptionTooltip: {
      id: "descriptionTooltip",
      content: "Length between 5 to 255 characters."
    }
  }

  schema = {
    publickey: Joi.string().required().label("Public Key"),
    description: Joi.string().required().label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await uploadPublicKey(data.keyType, data.publickey, data.description);
      window.location.reload();
      toast.success("Successfully uploaded.");
    }
    catch (ex) {
      console.log("failed to upload public key: " + ex.response.data);
      toast.error("Failed to upload public key.");
    }
  };

  schema = {
    publickey: Joi.string().required().label("Public Key"),
    description: Joi.string().required().min(5).max(255).label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  render() {
    const { keyTypes, publickeyTooltip, descriptionTooltip } =  this.state;
    return (
      <div className="w-100">
        <form onSubmit={this.handleSubmit}>
          {this.renderTextarea("publickey", "Public Key", true, publickeyTooltip)}
          {this.renderTextarea("description", "Description", true, descriptionTooltip)}
          {this.renderSelect("keyType", "Key Type", true, "", keyTypes)}
          {this.renderButton("Upload Public Key")}
        </form>
      </div>
    )
  }
}

export default UploadKey;