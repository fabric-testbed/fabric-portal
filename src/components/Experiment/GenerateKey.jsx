import Joi from "joi-browser";
import Form from "../common/Form";

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

  handleSubmit = () => {

  }

  handleChange = () => {

  }

  schema = {
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  render() {
    const { data, keyTypes } =  this.state;
    return (
      <div className="w-100">
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("keyType", "keyType", true, "", keyTypes)}
          {this.renderButton("Generate Key Pair")}
        </form>
      </div>
    )
  }
}

export default GenerateKey;