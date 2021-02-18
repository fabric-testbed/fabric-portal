import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import Parser from 'html-react-parser';

function ReactModal(props) {
  const [show, setShow] = useState(false);

  const logout = () => {
    // clear fabric-service auth cookie.
    // portal goes back to login page/ navbar with login button.
    document.cookie = "fabric-service=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  const handleClose = () => {
    setShow(false);
    logout();
  }
  const handleShow = () => {
    setShow(true);
  };

  return (
    <div>
      <Button variant="primary" onClick={handleShow}>
        {props.id}
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header>
          <Modal.Title>{props.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          { Parser(props.content) }
        </Modal.Body>
        <Modal.Footer>
          <a href={props.link} target="_blank">
            <Button variant="primary" onClick={handleClose}>Signup</Button>
          </a>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReactModal;