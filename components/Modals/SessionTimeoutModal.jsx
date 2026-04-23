"use client";
import { useState, useEffect, useRef } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import clearLocalStorage from "../../utils/clearLocalStorage";

export default function SessionTimeoutModal({ modalId, timeLeft, onExpired }) {
  const [show, setShow] = useState(true);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const countdownRef = useRef(null);

  const handleLogout = () => {
    setShow(false);
    clearLocalStorage();
    window.location.replace("/logout?url=" + encodeURIComponent(window.location.origin + "/"));
  };

  const handleClose = () => {
    setShow(false);
  };

  useEffect(() => {
    let mins = Math.floor(timeLeft / 60000);
    let secs = Math.floor((timeLeft % 60000) / 1000);
    setMinutes(mins);
    setSeconds(secs);

    countdownRef.current = setInterval(() => {
      if (secs > 0) {
        secs--;
      } else if (mins > 0) {
        mins--;
        secs = 59;
      } else {
        clearInterval(countdownRef.current);
        if (onExpired) onExpired();
        handleLogout();
        return;
      }
      setMinutes(mins);
      setSeconds(secs);
    }, 1000);

    return () => {
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [timeLeft]);

  const parseTimeStr = (m, s) => {
    if (m > 0 && s > 0) {
      return `${m} minute${m > 1 ? "s" : ""} ${s} second${s > 1 ? "s" : ""}`;
    }
    if (m > 0 && s === 0) {
      return `${m} minute${m > 1 ? "s" : ""}`;
    }
    if (m === 0 && s > 0) {
      return `${s} second${s > 1 ? "s" : ""}`;
    }
    return "";
  };

  if (timeLeft <= 0) return null;

  return (
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
        <p id="countdownTimerModal">
          The current session is about to expire in{" "}
          <span className="text-danger fw-bold">
            {parseTimeStr(minutes, seconds)}
          </span>
          . Please save your work to prevent loss of data.
        </p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleLogout}>
          Logout
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
