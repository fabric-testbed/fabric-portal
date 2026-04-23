import React, { useState, useEffect } from "react";
import KeyTabs from "../SshKey/KeyTabs";
import { getActiveKeys } from "../../services/sshKeyService";
import { toast } from "react-toastify";

function Keys() {
  const [keys, setKeys] = useState([]);

  useEffect(() => {
    const fetchKeys = async () => {
      try {
        const { data } = await getActiveKeys();
        const keysData = data.results;
        setKeys(keysData);
      } catch (err) {
        toast.error("Failed to load keys. Please reload this page.");
      }
    };
    fetchKeys();
  }, []);

  const getKeysData = () => {
    let sliverKeys = keys.filter(k => k.fabric_key_type === "sliver");
    let bastionKeys = keys.filter(k => k.fabric_key_type === "bastion");

    return { sliverKeys, bastionKeys};
  };

  const { sliverKeys, bastionKeys } = getKeysData();

  return (
    <div className="col-9" id="sshKeys">
      <KeyTabs
        sliverKeys={sliverKeys}
        bastionKeys={bastionKeys}
        disableKeyDelete={false}
        styleProp={"w-100"}
        parent={"Keys"}
      />
    </div>
  );
}

export default Keys;
