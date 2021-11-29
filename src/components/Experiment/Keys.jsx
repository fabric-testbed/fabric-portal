import React from "react";
import Joi from "joi-browser";
import KeyCards from "../SshKey/KeyCards";
import InputGroup from "react-bootstrap/InputGroup";
import GenerateKey from "../SshKey/GenerateKey";
import UploadKey from "../SshKey/UploadKey";
import { getKeys } from "../../services/fakeSSHKeys.js";
import { getActiveKeys } from "../../services/sshKeyService";
import paginate from "../../utils/paginate";
import _ from "lodash";
import { toast } from "react-toastify";

class Keys extends React.Component {
  state = {
    keys: getKeys(),
  };

  schema = {
    generate_name: Joi.string().allow(""),
    generate_description: Joi.string().required().label("Name"),
    upload_description: Joi.string().required().label("Description"),
  };

  // async componentDidMount() {
  //   try {
  //     const { data: keys } = await getActiveKeys();
  //     this.setState({ 
  //       keys: keys,
  //       allKeys: keys,
  //     })
  //   } catch (ex) {
  //     toast.error("Failed to load keys. Please reload this page.");
  //     console.log("Failed to load keys: " + ex.response.data);
  //   }
  // }

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
        <InputGroup className="mb-3">
          {/* <Button
            className="ml-4"
            variant="success"
            onClick={this.handleKeyGenerate}
            data-toggle="modal"
            data-target="#generatedKeyModal"
          >
            Generate Key Pair
          </Button> */}
          {/* <div
            className="modal fade"
            id={"generatedKeyModal"}
            data-backdrop="static"
            data-keyboard="false"
            tabIndex="-1"
            role="dialog"
            aria-labelledby={"generatedKeyModal-title"}
            aria-hidden="true"
          >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  Generated Key Pair
                </h5>
                <button className="btn btn-sm btn-outline-secondary" data-dismiss="modal" aria-label="Close">
                  <i className="fa fa-times"></i>
                </button>
              </div>
              <div className="modal-body">
                <li>
                  Public Key: <a href="#">your_key_name.pub</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <li className="my-4">
                  Private Key: <a href="#">your_key_name</a>
                  <button className="btn btn-outline-primary btn-sm ml-2">
                    <i className="fa fa-download"></i>
                  </button>
                </li>
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  The private key will be no longer accessible through the portal once you closed this window.
                  Please download and keep your private keys safe.
                </div>
              </div>
            </div>
          </div>
        </div> */}
        </InputGroup>
        <h3 className="my-4">Upload Public Key</h3>
        <UploadKey />
      </div>
    );
  }
}

export default Keys;