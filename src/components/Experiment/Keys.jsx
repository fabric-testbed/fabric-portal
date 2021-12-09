import React from "react";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import KeyCards from "../SshKey/KeyCards";
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


 getPageData = () => {
    const { keys } = this.state;

    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");
    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");

    let maxSliver = sliverKeys.length >= sliverKeyLimit;
    let maxBastion = bastionKeys.length >= bastionKeyLimit;

    return { sliverKeys, bastionKeys, maxSliver, maxBastion };
  };
  render() {
    const { sliverKeys, bastionKeys, maxSliver, maxBastion } = this.getPageData();

    return (
      <div className="col-9" id="sshKeys">
        <h1>SSH Keys</h1>
        <Tabs defaultActiveKey="sliver" id="ssh-keys-tab" className="mt-4 mb-3">
          <Tab eventKey="sliver" title={`Sliver (${sliverKeys.length})`}>
            <KeyCards keys={sliverKeys}/>
          </Tab>
          <Tab eventKey="bastion" title={`Bastion (${bastionKeys.length})`}>
            <KeyCards keys={bastionKeys}/>
          </Tab>
        </Tabs>
        <h3 className="my-4">Generate SSH Key Pair</h3>
        <GenerateKey maxSliver={maxSliver} maxBastion={maxBastion}/>
        <h3 className="my-4">Upload Public Key</h3>
        <UploadKey maxSliver={maxSliver} maxBastion={maxBastion}/>
      </div>
    );
  }
}

export default Keys;