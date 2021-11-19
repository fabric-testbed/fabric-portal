import Joi from "joi-browser";
import Form from "../common/Form";

class UploadKey extends Form {
  state = {
    data: {
      publickey: "",
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
    publickey: Joi.string().required().label("Public Key"),
    description: Joi.string().required().label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  render() {
    const { data, keyTypes } =  this.state;
    return (
      <div className="w-100">
        <form onSubmit={this.handleSubmit}>
          {this.renderTextarea("publickey", "Publickey", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("keyType", "keyType", true, "", keyTypes)}
          {this.renderButton("Upload Public Key")}
        </form>
      </div>
    )
  }
}

export default UploadKey;