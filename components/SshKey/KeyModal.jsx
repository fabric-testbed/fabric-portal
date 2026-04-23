import Modal from 'react-bootstrap/Modal';
import { useState, useEffect } from "react";
import { AlertTriangle, Download } from "lucide-react";

const KeyModal = ({ data, name }) => {
  const [show, setShow] = useState(false);
  const [private_key, setPrivateKey] = useState("");
  const [public_key, setPublicKey] = useState("");

  const handleClose = () => {
    window.location.reload();
    setShow(false);
    setPrivateKey("");
    setPublicKey("");
  }

  useEffect(() => {
    setShow(Object.keys(data).length !== 0);
    setPrivateKey(data.private_openssh);
    setPublicKey(data.public_openssh);
  }, [data]);

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Generated Key Pair</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <li className="mb-3">
          Private Key:
          <a
            className="btn btn-sm btn-outline-primary ms-3"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(private_key)}`}
            download={`${name}`}
          ><Download size={16} className="me-2" /> Download </a>
        </li>
        <li className="mb-3">
          Public Key: 
          <a
            className="btn btn-sm btn-outline-primary ms-4"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(public_key)}`}
            download={`${name}.pub`}
          ><Download size={16} className="me-2" /> Download </a>
        </li>
        <div className="alert alert-warning" role="alert">
          <AlertTriangle className="me-2" size={16} />
          The private key will be no longer accessible through the portal once you closed this window.
          Please download and keep your private keys safe.
        </div>  
      </Modal.Body>
    </Modal>
  );
}

export default KeyModal;
