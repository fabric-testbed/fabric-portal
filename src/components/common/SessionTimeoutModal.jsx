import React, { useState } from "react";
import Modal from 'react-bootstrap/Modal'
import Button from 'react-bootstrap/Button'

function ReactModal(props) {
  const [show, setShow] = useState(true, false);

  const handleLogout = () => {
    setShow(false);
    // remove old user status stored in browser.
    localStorage.removeItem("idToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("userID");
    localStorage.removeItem("bastionLogin");
    localStorage.removeItem("userStatus");
    localStorage.removeItem("sshKeyType");
    localStorage.removeItem("sliceDraft");
    window.location.href = "/logout";
  }

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <div>
      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Session Timeout</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            The current session is about to expire in 5 minutes.
            Please save your work to prevent loss of data.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReactModal;