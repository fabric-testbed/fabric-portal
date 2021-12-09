import React from "react";
import KeyTabs from "../SshKey/KeyTabs";
import GenerateKey from "../SshKey/GenerateKey";
import UploadKey from "../SshKey/UploadKey";
import { getKeys } from "../../services/fakeSSHKeys.js";
// import { getActiveKeys } from "../../services/sshKeyService";
import { sliverKeyLimit, bastionKeyLimit } from "../../services/portalData.json";
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


 getKeysData = () => {
    const { keys } = this.state;

    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");
    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");

    let maxSliver = sliverKeys.length >= sliverKeyLimit;
    let maxBastion = bastionKeys.length >= bastionKeyLimit;

    return { sliverKeys, bastionKeys, maxSliver, maxBastion };
  };

  render() {
    const { sliverKeys, bastionKeys, maxSliver, maxBastion } = this.getKeysData();

    return (
      <div className="col-9" id="sshKeys">
        <KeyTabs sliverKeys={sliverKeys} bastionKeys={bastionKeys} />
        <GenerateKey maxSliver={maxSliver} maxBastion={maxBastion}/>
        <UploadKey maxSliver={maxSliver} maxBastion={maxBastion}/>
      </div>
    );
  }
}

export default Keys;