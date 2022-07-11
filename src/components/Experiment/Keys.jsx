import React from "react";
import KeyTabs from "../SshKey/KeyTabs";
import GenerateKey from "../SshKey/GenerateKey";
import UploadKey from "../SshKey/UploadKey";
import { getActiveKeys } from "../../services/sshKeyService";

import { default as portalData } from "../../services/portalData.json";

import { toast } from "react-toastify";

class Keys extends React.Component {
  state = {
    keys: [],
  };

  async componentDidMount() {
    try {
      const { data } = await getActiveKeys();
      const keys = data.results[0];
      this.setState({ keys: keys });
    } catch (ex) {
      toast.error("Failed to load keys. Please reload this page.");
      console.log("Failed to load keys: " + ex.response.data);
    }
  }

 getKeysData = () => {
    const { keys } = this.state;

    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");
    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");

    let maxSliver = sliverKeys.length >= portalData.sliverKeyLimit;
    let maxBastion = bastionKeys.length >= portalData.bastionKeyLimit;

    return { sliverKeys, bastionKeys, maxSliver, maxBastion };
  };

  render() {
    const { sliverKeys, bastionKeys, maxSliver, maxBastion } = this.getKeysData();

    return (
      <div className="col-9" id="sshKeys">
        <KeyTabs sliverKeys={sliverKeys} bastionKeys={bastionKeys} disableKeyDelete={false} styleProp={"w-100"} parent={"Keys"}/>
        <GenerateKey maxSliver={maxSliver} maxBastion={maxBastion}/>
        <UploadKey maxSliver={maxSliver} maxBastion={maxBastion}/>
      </div>
    );
  }
}

export default Keys;