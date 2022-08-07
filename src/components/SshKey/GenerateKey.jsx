import Joi from "joi-browser";
import Form from "../common/Form";
import KeyModal from "./KeyModal";
import SpinnerWithText from "../common/SpinnerWithText";
import { generateKeyPairs } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class GenerateKey extends Form {
  state = {
    data: {
      name: "",
      description: "",
      keyType: "",
    },
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
    showKeySpinner: false
  }

  doSubmit = async () => {
    this.setState({ showKeySpinner: true });
    try {
      const { data } = this.state;
      const { resData } = await generateKeyPairs(data.keyType, data.name, data.description);
      this.setState({ generatedKey: resData, showKeySpinner: false });
      localStorage.setItem("sshKeyType", data.keyType);
    } catch (errorObj) {
      const errorMessage = errorObj.errors[0].details;
      console.log("failed to generate ssh key pairs: " + errorMessage);
      toast.error("Failed to generate ssh key pairs.");
      toast.error(errorMessage)
    }
  };

  schema = {
    name: Joi.string().regex(/^\S+$/).required().min(5).max(100).label("Name"),
    description: Joi.string().required().min(5).max(255).label("Description"),
    keyType: Joi.string().required().label("Key Type"),
  };

  getKeyTypeDropdown = (maxSliver, maxBastion) => {
    let dropdownItems = [];
    if (maxSliver) {
      dropdownItems = [
        { "_id": 1, "name": "bastion" },
      ]
    } else if (maxBastion) {
      dropdownItems = [
        { "_id": 1, "name": "sliver" },
      ]
    } else {
      dropdownItems = [
        { "_id": 1, "name": "sliver" },
        { "_id": 2, "name": "bastion" }
      ]
    }

    return dropdownItems;
  }

  render() {
    const { nameTooltip, descriptionTooltip, generatedKey, data,
      showKeySpinner } =  this.state;
    const { maxSliver, maxBastion } = this.props;
    return (
      <div className="w-100">
        <h3 className="my-4">Generate SSH Key Pair</h3>
        {
          showKeySpinner && <SpinnerWithText text={"Generating Keys..."} />
        }
        {
          maxSliver && maxBastion ? 
            <div className="alert alert-warning" role="alert">
              <i className="fa fa-exclamation-triangle mr-2"></i>
              You can store 10 keys for each type (sliver or bastion) at maximum. 
            </div>
            :
            <div>
              {
                maxSliver && 
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  You have reached the limit of 10 sliver keys.
                  You can still generate bastion keys.
                </div>
              }
              {
                maxBastion && 
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  You have reached the limit of 10 bastion keys.
                  You can still generate sliver keys.
                </div>
              }
              <KeyModal data={generatedKey} name={data.name} />
              {
                !showKeySpinner &&
                <form onSubmit={this.handleSubmit}>
                  {this.renderInput("name", "Name", true, nameTooltip)}
                  {this.renderTextarea("description", "Description", true, descriptionTooltip)}
                  {this.renderSelect("keyType", "Key Type", true, "", this.getKeyTypeDropdown(maxSliver, maxBastion))}
                  {this.renderButton("Generate Key Pair")}
                </form>
              }
            </div>
        }
      </div>
    )
  }
}

export default GenerateKey;