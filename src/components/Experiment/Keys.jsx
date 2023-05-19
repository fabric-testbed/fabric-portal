import React from "react";
import KeyTabs from "../SshKey/KeyTabs";
import { getActiveKeys } from "../../services/sshKeyService";
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

    return { sliverKeys, bastionKeys};
  };

  render() {
    const { sliverKeys, bastionKeys, currentKeyType } = this.getKeysData();

    return (
      <div className="col-9" id="sshKeys">
        <KeyTabs 
          sliverKeys={sliverKeys}
          bastionKeys={bastionKeys}
          disableKeyDelete={false}
          styleProp={"w-100"}
          parent={"Keys"}
          currentKeyType={currentKeyType}
        />
      </div>
    );
  }
}

export default Keys;