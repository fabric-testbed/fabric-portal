import React, { useState, useRef } from "react";
import Spinner from 'react-bootstrap/Spinner';
import Overlay from 'react-bootstrap/Overlay';
import Button from 'react-bootstrap/Button';

function LoadSpinner(){
  const [show, setShow] = useState(false);
  const target = useRef(null);
  return (
    <div>
      <Button ref={target} onClick={() => setShow(!show)}
       style={{
        position:"absolute",
        top: 0,
        left: 0,
        width: "0.1rem",
        height: "0.1rem",
        backgroundColor: "transparent",
        border: "none",
        overflow: "hidden",
        outline: "none"
      }}
      >
        Hidden
      </Button>
      <Overlay target={target.current} show={show} placement="auto">
        {({ placement, arrowProps, show: _show, popper, ...props }) => (
          <div
            {...props}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              width: "100%",
              height: "100vh",
              overflow: "hidden",
              color: 'white',
              fontSize: "2rem",
              ...props.style,
            }}
            className="d-flex align-items-center justify-content-center"
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
