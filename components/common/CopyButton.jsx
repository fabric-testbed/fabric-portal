'use client'; // ensures this uses browser APIs
import { useCopyToClipboard } from 'usehooks-ts';
import React, { Component, useState } from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
); 

export default function CopyButton({ btnStyle, showCopiedValue, id }) {
  const [copiedText, copy] = useCopyToClipboard();
  const [show, setShow] = useState(false);

  const overlayText = showCopiedValue ? `Copied: ${id}` : `Copied!`

  const handleCopy = async () => {
    await copy(id)
    setShow(true)

    // auto-hide after 2 seconds
    setTimeout(() => setShow(false), 2000)
  }

  return (
    <OverlayTrigger
      show={show}
      placement="right"
      delay={{ show: 100, hide: 300 }}
      overlay={renderTooltip(
        `copy-success-${id}`,
        overlayText
      )}
    >
      <button
        onClick={handleCopy}
        className={`btn btn-sm btn-${btnStyle}`}
        onMouseLeave={() => setShow(false)}
      >
        Copy
      </button>
  </OverlayTrigger>
  );
}
