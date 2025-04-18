import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

const Textarea = ({ name, label, error, disabled, tooltip, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>
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
      <textarea {...rest} id={name} name={name} className="form-control" disabled={disabled}/>
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default Textarea;
