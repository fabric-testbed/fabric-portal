import React from "react";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import KeyCards from "./KeyCards";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete, styleProp }) => {
  return (
    <div className={styleProp}>
      <h1>SSH Keys</h1>
      <Tabs defaultActiveKey="sliver" id="ssh-keys-tab" className="mt-4 mb-3">
        <Tab eventKey="sliver" title={`Sliver (${sliverKeys.length})`}>
          {
            sliverKeys.length > 0 ? 
            <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} /> :
            <span>You have no sliver key. Please try to generate or upload.</span>
          }
        </Tab>
        <Tab eventKey="bastion" title={`Bastion (${bastionKeys.length})`}>
          {
            bastionKeys.length > 0 ? 
            <KeyCards keys={bastionKeys} disableKeyDelete={disableKeyDelete} /> :
            <span>You have no bastion key. Please try to generate or upload.</span>
          }
        </Tab>
      </Tabs>
    </div>
  );
};

export default KeyTabs;
