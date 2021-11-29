import Joi from "joi-browser";
import Form from "../common/Form";
import KeyModal from "./KeyModal";
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
    generatedKey: {
      "private_openssh": "-----BEGIN OPENSSH PRIVATE KEY-----*******-----END OPENSSH PRIVATE KEY-----\n",
      "public_openssh": "ssh-rsa AAAAB3NzaC1yc2EAAAADAQABAAABgQCr0M3Jzy+TE2SN9+sXsQZReHvno+nERIC0Mgmlt7iPU2PY3oSHP+Y+7fmbDJado+u0We2DBGnBhsLOjyxpfIXJY5COzLMUH6c0yIPYnwo9D9WCTvn1srCLnbkPpeRWEASUUgOcppIo/+oQ028QupvUyIXxpR2NACi/VpMs51u25NK6H4ES/5uP6oGTe5z1slcetkGCb2eUarlFk04rIvvayoJGK5SYtEXOV9xEvuoj4erP+FvaIzDePZ02o9wZD/5QHLpwn0kpqwxcopH+W9vN4e+fLG9bEaj2L9SokbhMCTHsDZoIS37uzxA6/gzdDnsYe3W3i6wQxcXSNO0zVcrORtLMFG9Q/5bCiWmGNN7eXy/fhnJoWlpqxw/f6PFrUTevTuzEhhYXQGIkr+bYL21ab316/Wq2umrYwVp+iRb78CNb9zfQtTBiFOle5T1VG4hCPYgL+JEvFhrp6QUx0zp42+RIwFaw+ktV7rbeY8fKNIVzd2hij04pFpsIck8f5jM= test-key-2"
    },
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
        <KeyModal data={generatedKey} />
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true, nameTooltip)}
          {this.renderTextarea("description", "Description", true, descriptionTooltip)}
          {this.renderSelect("keyType", "Key Type", true, "", keyTypes)}
          {this.renderButton("Generate Key Pair")}
        </form>
      </div>
    )
  }
}

export default GenerateKey;