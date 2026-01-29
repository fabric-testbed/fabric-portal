"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import Link from "next/link";
import Parser from "html-react-parser";

// Prevent SSR for react-bootstrap components
const Modal = dynamic(() => import("react-bootstrap/Modal"), {
  ssr: false,
});
const Button = dynamic(() => import("react-bootstrap/Button"), {
  ssr: false,
});

function ReactModal({ title, content }) {
  const [show, setShow] = useState(true);

  const handleClose = () => {
    setShow(false);

    if (typeof window !== "undefined") {
      localStorage.removeItem("userStatus");
      localStorage.removeItem("userID");
      localStorage.removeItem("userName");
      localStorage.removeItem("userEmail");
      window.location.href = "/logout";
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
        <Link href="/help/signup/1">
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
