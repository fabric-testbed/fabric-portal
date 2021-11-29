import React from "react";
import Joi from "joi-browser";
import KeyCards from "../SshKey/KeyCards";
import GenerateKey from "../SshKey/GenerateKey";
import UploadKey from "../SshKey/UploadKey";
// import { getKeys } from "../../services/fakeSSHKeys.js";
import { getActiveKeys } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class Keys extends React.Component {
  state = {
    keys: [],
  };

  schema = {
    generate_name: Joi.string().allow(""),
    generate_description: Joi.string().required().label("Name"),
    upload_description: Joi.string().required().label("Description"),
  };

  async componentDidMount() {
    try {
      const { data: keys } = await getActiveKeys();
      this.setState({ keys: keys });
    } catch (ex) {
      toast.error("Failed to load keys. Please reload this page.");
      console.log("Failed to load keys: " + ex.response.data);
    }
  }

  render() {
    const { keys } = this.state;

    return (
      <div className="col-9" id="sshKeys">
        <h1>SSH Keys</h1>
        <div className="my-2">
          Showing {keys.length} keys.
        </div>
        <KeyCards
          keys={keys}
        />
        <h3 className="my-4">Generate SSH Key Pair</h3>
        <GenerateKey />
        <h3 className="my-4">Upload Public Key</h3>
        <UploadKey />
      </div>
    );
  }
}

export default Keys;