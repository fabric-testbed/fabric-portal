import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'
import { NavLink } from "react-router-dom";
import Parser from 'html-react-parser';

function ReactModal(props) {
  const [show, setShow] = useState(true, false);

  const handleClose = () => {
    setShow(false);
    // remove old user status stored in browser.
    localStorage.removeItem("userStatus");
    localStorage.removeItem("userID");
    window.location.href = "/logout";
  }

  const handleSignup = () => {
    setShow(false);
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
          <NavLink to="/signup/1"><Button variant="primary" onClick={handleSignup}>Signup</Button></NavLink>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReactModal;