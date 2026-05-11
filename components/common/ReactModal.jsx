"use client";

import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Link from "next/link";
import Parser from "html-react-parser";

function ReactModal({ title, content }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);
    if (typeof window !== "undefined") {
      window.location.replace("/logout?url=" + encodeURIComponent(window.location.origin + "/"));
    }
  };

  const handleSignup = () => {
    setShow(false);
  };

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>

      <Modal.Body>{Parser(content)}</Modal.Body>

      <Modal.Footer>
        <Link href="/signup/1">
          <Button variant="primary" onClick={handleSignup}>
            Signup
          </Button>
        </Link>

        <Button variant="secondary" onClick={handleClose}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ReactModal;
