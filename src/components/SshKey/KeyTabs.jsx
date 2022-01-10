import React from "react";
import Tabs from "../common/Tabs";
import KeyCards from "./KeyCards";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete, styleProp }) => {
  return (
    <div className={styleProp}>
      <h1 className="mb-3">SSH Keys</h1>
      <Tabs>
        <div label="Sliver" number={sliverKeys.length}>
          {
            sliverKeys.length > 0 ? 
            <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} /> :
            <div className="alert alert-warning" role="alert">You have no sliver key. Please try to generate or upload.</div>
          }
        </div>
        <div label="Bastion" number={bastionKeys.length}>
          <div class="alert alert-info" role="alert">
            <b>Bastion login</b>: {localStorage.getItem("bastionLogin")}
          </div>
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
