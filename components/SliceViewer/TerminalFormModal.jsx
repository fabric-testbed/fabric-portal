"use client";
import { useState } from "react";
import checkPortalType from "@/lib/permissions/checkPortalType";
import SpinnerWithText from "../common/SpinnerWithText";
import { getSessionItem } from "@/utils/sessionCookies";
import { default as portalData } from "../../services/portalData.json";
import { Modal, OverlayTrigger, Tooltip } from "react-bootstrap";
import { LogIn, HelpCircle, AlertTriangle } from "lucide-react";

const sliverTooltip = {
  id: "sliverKeyTooltip",
  content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
};

const bastionTooltip = {
  id: "bastionKeyTooltip",
  content: "Paste your private key value here. It will be used as authorization credential to log in to the web terminal and will be cleared from the browser storage afterwards."
};

export default function TerminalFormModal({ data, ephemeralKey, onGenerateEphemeralKey, show, onHide }) {
  const [sliverPrivateKey, setSliverPrivateKey] = useState("");
  const [bastionPrivateKey, setBastionPrivateKey] = useState("");
  const [showSpinner, setShowSpinner] = useState(false);
  const [keySelectStatus, setKeySelectStatus] = useState("unselected");

  const handleSubmit = (e) => {
    e.preventDefault();
    const domain = "fabric-testbed.net";
    const credentials = {
      hostname: data.properties.MgmtIp,
      username: data.properties.ImageRef
        ? portalData.usernameOnImageMapping[data.properties.ImageRef.split(",")[0]]
        : "fabric",
      privatekey: sliverPrivateKey ? sliverPrivateKey : ephemeralKey.private_openssh,
    };
    const bastion_credentials = {
      hostname: portalData.bastionHostname,
      username: getSessionItem("bastionLogin"),
      privatekey: bastionPrivateKey,
    };
    const cred_string = btoa(unescape(encodeURIComponent(JSON.stringify(credentials))));
    const bast_string = btoa(unescape(encodeURIComponent(JSON.stringify(bastion_credentials))));
    document.cookie = `credentials=${cred_string};domain=${domain};SameSite=Strict;path=/`;
    document.cookie = `bastion-credentials=${bast_string};domain=${domain};SameSite=Strict;path=/`;
    setShowSpinner(true);
  };

  const closeModal = () => {
    setTimeout(() => {
      document.cookie = `credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
      document.cookie = `bastion-credentials=nomore;domain=fabric-testbed.net;SameSite=Strict;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/`;
    }, 10000);
    setSliverPrivateKey("");
    setBastionPrivateKey("");
    setShowSpinner(false);
    onHide();
  };

  const renderTooltipOverlay = (id, content) => (
    <Tooltip id={id}>{content}</Tooltip>
  );

  return (
    <Modal show={show} onHide={closeModal} centered>
      <Modal.Header closeButton>
        <Modal.Title>Connect to Web SSH App</Modal.Title>
      </Modal.Header>
      {showSpinner && (
        <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
          <SpinnerWithText text={"Connecting to VM..."} />
          <a
            href={portalData.webSshAppLinks[checkPortalType(window.location.href)]}
            target="_blank"
            rel="noopener noreferrer"
          >
            <button
              className="mt-2 btn btn-sm btn-primary"
              onClick={closeModal}
            >
              <LogIn className="me-2" size={16} />
              Open Terminal
            </button>
          </a>
        </Modal.Body>
      )}
      {!showSpinner && (
        <Modal.Body>
          {data && data.properties && (
            <form onSubmit={handleSubmit}>
              <div className="row mb-2 mx-1">
                <label>Hostname</label>
                <input type="text" className="form-control" defaultValue={data.properties.MgmtIp} disabled />
              </div>
              {data.properties.ImageRef && (
                <div className="row mb-2 mx-1">
                  <label>Username</label>
                  <input type="text" className="form-control" defaultValue={portalData.usernameOnImageMapping[data.properties.ImageRef.split(",")[0]]} disabled />
                </div>
              )}
              <div className="row mb-2 mx-1">
                <label>Bastion Hostname</label>
                <input type="text" className="form-control" defaultValue={portalData.bastionHostname} disabled />
              </div>
              <div className="row mb-2 mx-1">
                <label>Bastion Username</label>
                <input type="text" className="form-control" defaultValue={getSessionItem("bastionLogin")} disabled />
              </div>
              <div className="alert alert-primary mt-2 mb-1" role="alert">
                <AlertTriangle className="me-1" size={16} />
                Your private keys will only be used to establish connection and will not be stored.
              </div>
              <div className="row mx-1 mt-2">
                <label>Please choose</label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="keyRadios"
                  id="keyRadios1"
                  value="copied"
                  checked={keySelectStatus === "copied"}
                  onChange={(e) => setKeySelectStatus(e.target.value)}
                />
                <label className="form-check-label" htmlFor="keyRadios1">
                  Input Sliver Private Key
                </label>
              </div>
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="keyRadios"
                  id="keyRadios2"
                  value="ephemeral"
                  checked={keySelectStatus === "ephemeral"}
                  onChange={(e) => setKeySelectStatus(e.target.value)}
                  onClick={() => onGenerateEphemeralKey()}
                />
                <label className="form-check-label" htmlFor="keyRadios2">
                  Generate and Install Ephemeral Key
                </label>
              </div>
              {keySelectStatus === "copied" && (
                <div className="row mb-2 mx-1">
                  <label>
                    Sliver Private Key
                    <OverlayTrigger
                      placement="right"
                      delay={{ show: 100, hide: 300 }}
                      overlay={renderTooltipOverlay(sliverTooltip.id, sliverTooltip.content)}
                    >
                      <HelpCircle className="mx-2 text-secondary" size={16} />
                    </OverlayTrigger>
                  </label>
                  <textarea
                    type="text"
                    className="form-control"
                    value={sliverPrivateKey}
                    onChange={(e) => setSliverPrivateKey(e.target.value)}
                  />
                </div>
              )}
              {keySelectStatus === "ephemeral" && (
                <div className="row mb-2 mx-1">
                  <label>Ephemeral Sliver Private Key</label>
                  <textarea type="text" className="form-control" defaultValue={ephemeralKey.private_openssh} disabled />
                </div>
              )}
              <div className="row mb-2 mx-1">
                <label>
                  Bastion Private Key
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 100, hide: 300 }}
                    overlay={renderTooltipOverlay(bastionTooltip.id, bastionTooltip.content)}
                  >
                    <HelpCircle className="mx-2 text-secondary" size={16} />
                  </OverlayTrigger>
                </label>
                <textarea
                  type="text"
                  className="form-control"
                  value={bastionPrivateKey}
                  onChange={(e) => setBastionPrivateKey(e.target.value)}
                />
              </div>
              <button className="btn btn-primary">Connect</button>
            </form>
          )}
        </Modal.Body>
      )}
    </Modal>
  );
}
