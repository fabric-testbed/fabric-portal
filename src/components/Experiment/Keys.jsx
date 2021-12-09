import React from "react";
import KeyCards from "../SshKey/KeyCards";
import GenerateKey from "../SshKey/GenerateKey";
import UploadKey from "../SshKey/UploadKey";
import { getKeys } from "../../services/fakeSSHKeys.js";
// import { getActiveKeys } from "../../services/sshKeyService";
import { toast } from "react-toastify";

class Keys extends React.Component {
  state = {
    keys: getKeys(),
  };

  // async componentDidMount() {
  //   try {
  //     const { data: keys } = await getActiveKeys();
  //     this.setState({ keys: keys });
  //   } catch (ex) {
  //     toast.error("Failed to load keys. Please reload this page.");
  //     console.log("Failed to load keys: " + ex.response.data);
  //   }
  // }


 getPageData = () => {
    const { keys } = this.state;

    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");
    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");


    return { bastionKeys, sliverKeys };
  };
  render() {
    const { keys } = this.state;
    const { bastionKeys, sliverKeys } = this.getPageData();

    return (
      <div className="col-9" id="sshKeys">
        <h1>SSH Keys</h1>
        <div className="my-2">
          Showing {bastionKeys.length} bastion keys and {sliverKeys.length} sliver keys.
        </div>
        <KeyCards keys={keys}/>
        <h3 className="my-4">Generate SSH Key Pair</h3>
        <GenerateKey />
        <h3 className="my-4">Upload Public Key</h3>
        <UploadKey />
      </div>
    );
  }
}

export default Keys;