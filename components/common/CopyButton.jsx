'use client';

import { useCopyToClipboard } from 'usehooks-ts';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Prevent SSR for react-bootstrap overlays
const OverlayTrigger = dynamic(
  () => import('react-bootstrap/OverlayTrigger'),
  { ssr: false }
);

const Tooltip = dynamic(
  () => import('react-bootstrap/Tooltip'),
  { ssr: false }
);

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

export default function CopyButton({ btnStyle, showCopiedValue, id }) {
  const [, copy] = useCopyToClipboard();
  const [show, setShow] = useState(false);

  const overlayText = showCopiedValue
    ? `Copied: ${id}`
    : 'Copied!';

  const handleCopy = async () => {
    await copy(id);
    setShow(true);
    setTimeout(() => setShow(false), 2000);
  };

  return (
    <OverlayTrigger
      show={show}
      placement="right"
      delay={{ show: 100, hide: 300 }}
      overlay={renderTooltip(`copy-success-${id}`, overlayText)}
    >
      <button
        type="button"
        onClick={handleCopy}
        onMouseLeave={() => setShow(false)}
        className={`btn btn-sm btn-${btnStyle}`}
      >
        Copy
      </button>
    </OverlayTrigger>
  );
}
