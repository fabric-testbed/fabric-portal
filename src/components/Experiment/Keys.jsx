import React from "react";
import KeyTabs from "../SshKey/KeyTabs";
import { getActiveKeys } from "../../services/sshKeyService";
import { default as portalData } from "../../services/portalData.json";
import { toast } from "react-toastify";

class Keys extends React.Component {
  state = {
    keys: [],
    currentKeyType: "sliver"
  };

  async componentDidMount() {
    try {
      const { data } = await getActiveKeys();
      const keys = data.results;
      this.setState({ keys });
    } catch (err) {
      toast.error("Failed to load keys. Please reload this page.");
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
    const { sliverKeys, bastionKeys, maxSliver, maxBastion, currentKeyType } = this.getKeysData();

    return (
      <div className="col-9" id="sshKeys">
        <KeyTabs 
          sliverKeys={sliverKeys}
          bastionKeys={bastionKeys}
          disableKeyDelete={false}
          styleProp={"w-100"}
          parent={"Keys"}
          maxSliver={maxSliver}
          maxBastion={maxBastion}
          currentKeyType={currentKeyType}
        />
      </div>
    );
  }
}

export default Keys;