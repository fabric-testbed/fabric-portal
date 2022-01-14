import React from "react";
import Tabs from "../common/Tabs";
import KeyCards from "./KeyCards";
import CopyButton from "../common/CopyButton";
import { guideToLoginToFabricVMs } from "../../services/portalData.json";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete, styleProp }) => {
  return (
    <div className={styleProp}>
      <h1 className="mb-3">SSH Keys</h1>
      <div class="alert alert-primary" role="alert">
        Please consult &nbsp;
        <a
          href={guideToLoginToFabricVMs}
          target="_blank"
          rel="noreferrer"
        >
          this guide
        </a>&nbsp;
        to login to your VMs via bastion hosts.
        <span className="ml-2"><b>Bastion login</b>: {localStorage.getItem("bastionLogin")}</span>
        <CopyButton id={localStorage.getItem("bastionLogin")} text=""></CopyButton>
      </div>
      <Tabs>
        <div label="Sliver" number={sliverKeys.length}>
          {
            sliverKeys.length > 0 ? 
            <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} /> :
            <div className="alert alert-warning" role="alert">You have no sliver key. Please try to generate or upload.</div>
          }
        </div>
        <div label="Bastion" number={bastionKeys.length}>
          {
            bastionKeys.length > 0 ? 
            <KeyCards keys={bastionKeys} disableKeyDelete={disableKeyDelete} /> :
            <div className="alert alert-warning" role="alert">You have no bastion key. Please try to generate or upload.</div>
          }
        </div>
      </Tabs>
    </div>
  );
};

export default KeyTabs;
