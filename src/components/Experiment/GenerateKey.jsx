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
      { "_id": 1, "name": "Sliver" },
      { "_id": 2, "name": "Bastion" }
    ],
    errors: {},
  }

  doSubmit = async () => {
    try {
      const { data } = this.state;
      await generateKeyPairs(data.keyType, data.name, data.description);
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
    // const that = this;
    const { data, keyTypes } =  this.state;
    return (
      <div className="w-100">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("keyType", "Key Type", true, "", keyTypes)}
          {this.renderButton("Generate Key Pair")}
        </form>
      </div>
    )
  }
}

export default GenerateKey;