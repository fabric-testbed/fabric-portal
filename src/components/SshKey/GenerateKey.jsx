import Joi from "joi-browser";
import Form from "../common/Form/Form";
import KeyModal from "./KeyModal";
import SpinnerWithText from "../common/SpinnerWithText";
import { generateKeyPairs } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class GenerateKey extends Form {
  state = {
    data: {
      name: "",
      description: "",
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
      const { data: res } = await generateKeyPairs(data.name, data.description);
      this.setState({ generatedKey: res.results[0], showKeySpinner: false });
    } catch (err) {
      this.setState({ showKeySpinner: false });
      toast.error("Failed to generate ssh key pairs.");
    } 
  };

  schema = {
    name: Joi.string().regex(/^\S+$/).required().min(5).max(100).label("Name"),
    description: Joi.string().required().min(5).max(255).label("Description"),
  };

  render() {
    const { nameTooltip, descriptionTooltip, generatedKey, data,
      showKeySpinner } =  this.state;

    return (
      <div className="w-100">
        <h3 className="my-4">Generate SSH Key Pair</h3>
        {
          showKeySpinner && <SpinnerWithText text={"Generating Keys..."} />
        }
        <KeyModal data={generatedKey} name={data.name} />
        {
          !showKeySpinner &&
          <form onSubmit={this.handleSubmit}>
            {this.renderInput("name", "Name", true, nameTooltip)}
            {this.renderTextarea("description", "Description", true, descriptionTooltip)}
            {this.renderButton("Generate Key Pair")}
          </form>
        }
      </div>
    )
  }
}

export default GenerateKey;