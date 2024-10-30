import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

const Switch = ({ name, label, error, disabled, tooltip, ...rest }) => {
  return (
    <div className="custom-control custom-switch">
      <input
        type="checkbox"
        className="custom-control-input"
        id={`switch-${name}`}
        disabled={disabled}
      />
      <label className="custom-control-label" for="customSwitch1">
        {label}
        {
          tooltip && 
          <OverlayTrigger
            placement="right"
            delay={{ show: 100, hide: 300 }}
            overlay={renderTooltip(tooltip.id, tooltip.content)}
          >
            <i className="fa fa-question-circle text-secondary ms-2"></i>
          </OverlayTrigger>
        }
      </label>
    </div>
  );
};

export default Switch;
