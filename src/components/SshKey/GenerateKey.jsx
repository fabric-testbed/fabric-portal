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
      content: "A single word without whitespace; length between 5 to 100 characters."
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
      const response = await generateKeyPairs(data.keyType, data.name, data.description);
      this.setState({ generatedKey: response.data });
    }
    catch (ex) {
      console.log("failed to generate ssh key pairs: " + ex.response.data);
      toast.error("Failed to generate ssh key pairs.");
    }
  };
  
  schema = {
    name: Joi.string().required().min(5).max(100).label("Name"),
    description: Joi.string().required().min(5).max(255).label("Description"),
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