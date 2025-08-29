import React from "react";
import Link from "next/link";
import Tabs from "../common/Tabs";
import KeyCards from "./KeyCards";
import GenerateKey from "./GenerateKey";
import UploadKey from "./UploadKey";
import CopyButton from "../common/CopyButton";
import { default as portalData } from "../../services/portalData.json";

const KeyTabs = ({ sliverKeys, bastionKeys, disableKeyDelete, styleProp, parent }) => {
  return (
    <div className={styleProp}>
      {
        parent === "Keys" && <h1 className="mb-3">SSH Keys</h1>
      }
      {
        parent === "UserProfile" &&   
        <div className="d-flex flex-row justify-content-between">
          <h1 className="mb-3">SSH Keys</h1>
          <Link href="/experiments#sshKeys">
            <button
              className="btn btn-sm btn-outline-primary my-3"
            >
              <i className="fa fa-sign-in me-2"></i>
              Manage SSH Keys
            </button>
          </Link>
        </div>
      }
      <div className="alert alert-primary" role="alert">
        Please consult &nbsp;
        <a
          href={portalData.learnArticles.guideToLoginToFabricVMs}
          target="_blank"
          rel="noreferrer"
        >
          this guide
        </a>&nbsp;
        to login to your VMs via bastion hosts.
      </div>
      <div className="alert alert-primary" role="alert">
        <span className="me-2"><b>Bastion login</b>: {localStorage.getItem("bastionLogin")}</span>
        <CopyButton
          id={localStorage.getItem("bastionLogin")}
          text=""
          btnStyle={"btn btn-sm btn-primary"}
          showCopiedValue={true}
        />
      </div>
      <Tabs activeTab={localStorage.getItem("sshKeyType") === "Bastion" ? "Bastion" : "Sliver"}>
        <div label="Sliver" badge={sliverKeys? sliverKeys.length : "0"} color={"primary"}>
          <div className="alert alert-primary" role="alert">
            Currently the sliver keys here are only used when you build a slice via the Portal. JupyterHub uses locally-generated sliver keys.
          </div>
          {
            <div>
              {
                sliverKeys.length > 0 &&
                <KeyCards keys={sliverKeys} disableKeyDelete={disableKeyDelete} />
              }
              {
                sliverKeys.length === 0 &&
                <div className="alert alert-warning" role="alert">
                  You have no sliver keys. Please try to generate or upload.
                </div>
              }
              {
                parent === "Keys" &&
                sliverKeys.length <= portalData.keyLimit &&
                <div>
                  <GenerateKey type="Sliver" />
                  <UploadKey type="Sliver"/>
                </div>
              }
              {
                parent === "Keys" &&
                sliverKeys.length > portalData.keyLimit &&
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle me-2"></i>
                  You have reached the limit of {portalData.keyLimit} sliver keys.
                </div>
              }
            </div>
          }
        </div>
        <div label="Bastion" badge={bastionKeys? bastionKeys.length : "0"} color={"primary"}>
            <div>
              {
                bastionKeys.length > 0 &&
                <KeyCards keys={bastionKeys} disableKeyDelete={disableKeyDelete} />
              }
              {
                bastionKeys.length === 0 && 
                <div className="alert alert-warning" role="alert">
                  You have no bastion keys. Please try to generate or upload.
                </div>
              }
              {
                parent === "Keys" &&
                bastionKeys.length <= portalData.keyLimit && <div>
                  <GenerateKey type="Bastion" />
                  <UploadKey type="Bastion" />
                </div>
              }
              {
                parent === "Keys" &&
                bastionKeys.length > portalData.keyLimit &&
                <div className="alert alert-warning" role="alert">
                  <i className="fa fa-exclamation-triangle me-2"></i>
                  You have reached the limit of {portalData.keyLimit} bastion keys.
                </div>
              }
            </div>
        </div>
      </Tabs>
    </div>
  );
};

export default KeyTabs;
