import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useState, useEffect } from "react";

const KeyModal = ({data}) => {
  const [show, setShow] = useState(false);

  const handleClose = () => {
    window.location.reload();
    setShow(false);
  }

  useEffect(() => {
    setShow(Object.keys(data).length !== 0)
  }, [data]);

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Generated Key Pair</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <li className="mb-3">
            Private Key: 
            <a
              className="btn btn-sm btn-outline-primary ml-3"
              href={`data:text/json;charset=utf-8,${encodeURIComponent(data.private_openssh)}`}
              download={`private_key.json`}
            ><i className="fa fa-download"></i> Download </a>
          </li>
          <li className="mb-3">
            Public Key: 
            <a
              className="btn btn-sm btn-outline-primary ml-4"
              href={`data:text/json;charset=utf-8,${encodeURIComponent(data.public_openssh)}`}
              download={`public_key.json`}
            ><i className="fa fa-download"></i> Download </a>
          </li>
          <div className="alert alert-warning" role="alert">
            <i className="fa fa-exclamation-triangle mr-2"></i>
            The private key will be no longer accessible through the portal once you closed this window.
            Please download and keep your private keys safe.
          </div>  
        </Modal.Body>
      </Modal>
    </>
  );
}

export default KeyModal;
