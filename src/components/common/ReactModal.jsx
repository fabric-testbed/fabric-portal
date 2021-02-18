import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

import Parser from 'html-react-parser';

function ReactModal(props) {
  const [show, setShow] = useState(true, false);

  const handleClose = (action) => {
    setShow(false);
    if (action === "signup") {
      window.open(props.link, "_blank");
    }
    window.location.href = "/logout";
  }

  return (
    <div>
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
          <Button variant="primary" onClick={handleClose("signup")}>Signup</Button>
          <Button variant="secondary" onClick={handleClose("cancel")}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReactModal;