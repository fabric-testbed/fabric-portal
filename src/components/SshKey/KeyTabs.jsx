import React from "react";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import KeyCards from "./KeyCards";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete }) => {
  return (
    <div className="w-100">
      <h1>SSH Keys</h1>
      <Tabs defaultActiveKey="sliver" id="ssh-keys-tab" className="mt-4 mb-3">
        <Tab eventKey="sliver" title={`Sliver (${sliverKeys.length})`}>
          <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} />
        </Tab>
        <Tab eventKey="bastion" title={`Bastion (${bastionKeys.length})`}>
          <KeyCards keys={bastionKeys} disableKeyDelete={disableKeyDelete} />
        </Tab>
      </Tabs>
    </div>
  );
};

export default KeyTabs;
