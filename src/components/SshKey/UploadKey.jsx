import Joi from "joi-browser";
import Form from "../common/Form/Form";
import { uploadPublicKey } from "../../services/sshKeyService";
import { default as portalData } from "../../services/portalData.json";
import { toast } from "react-toastify";

class UploadKey extends Form {
  state = {
    data: {
      publickey: "",
      description: "",
    },
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

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await uploadPublicKey(data.publickey, data.description);
      window.location.reload();
      toast.success("Successfully uploaded.");
    } catch (err) {
      toast.error("Failed to upload public key"); 
    }
  };

  schema = {
    publickey: Joi.string().required().label("Public Key"),
    description: Joi.string().required().min(5).max(255).label("Description"),
  };

  render() {
    const { publickeyTooltip, descriptionTooltip } =  this.state;
    const keyType = localStorage.getItem("sshKeyType") === "bastion" ? "Bastion" : "Sliver";

    return (
      <div className="w-100 mb-4">
        <h3 className="mt-4 mb-2">Upload Public {keyType} Key</h3>
          <div className="alert alert-primary" role="alert">
            Please follow &nbsp;
            <a
              href={portalData.learnArticles.guideToGenerateFabricCompliantKey}
              target="_blank"
              rel="noreferrer"
            >
              this guide
            </a>&nbsp;
            to generate FABRIC-compliant keys. We accept keys in OpenSSH key format.
          </div>
          <form onSubmit={this.handleSubmit}>
            {this.renderTextarea("publickey", "Public Key", true, publickeyTooltip)}
            {this.renderTextarea("description", "Description", true, descriptionTooltip)}
            {this.renderButton("Upload Public Key")}
          </form>
      </div>
    )
  }
}

export default UploadKey;