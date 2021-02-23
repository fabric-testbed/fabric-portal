import React, { useState, useRef } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';

function LoadSpinner(){
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <div>
      <Button variant="danger" ref={target} onClick={() => setShow(!show)}>
        Show Spinner
      </Button>
      <Overlay target={target.current} show={show} placement="right">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              padding: '100px 100px',
              width: "100%",
              height: "100%",
              color: 'white',
              fontSize: "2rem",
              ...props.style,
            }}
          >
            Creating project...
            <Spinner animation="border" role="status" variant="white" />
          </div>
        )}
      </Overlay>
    </div>
  );
};

export default LoadSpinner;
