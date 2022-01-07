import React from "react";
// import Tabs from 'react-bootstrap/Tabs';
// import Tab from 'react-bootstrap/Tab';
import Tabs from "../common/Tabs";
import Tab from "../common/Tab";
import KeyCards from "./KeyCards";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete, styleProp }) => {
  return (
    <div className={styleProp}>
      <h1 className="mb-3">SSH Keys</h1>
      <Tabs>
        <div label="Sliver">
          {
            sliverKeys.length > 0 ? 
            <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} /> :
            <div className="mb-2">You have no sliver key. Please try to generate or upload.</div>
          }
        </div>
        <div label="Bastion">
          <div class="alert alert-info" role="alert">
            <b>Bastion login</b>: {localStorage.getItem("bastionLogin")}
          </div>
          {
            bastionKeys.length > 0 ? 
            <KeyCards keys={bastionKeys} disableKeyDelete={disableKeyDelete} /> :
            <div className="mb-2">You have no bastion key. Please try to generate or upload.</div>
          }
        </div>
      </Tabs>
    </div>
  );
};

export default KeyTabs;
