import React from "react";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const renderTooltip = (id, content) => (
  <Tooltip id={id}>
    {content}
  </Tooltip>
);

const Select = ({ name, label, currentOption, options, error, disabled, tooltip, ...rest }) => {
  return (
    <div className="form-group">
      {
        tooltip ? <label htmlFor={name}>
          {label} 
          <OverlayTrigger
            placement="right"
            delay={{ show: 100, hide: 300 }}
            overlay={renderTooltip("select-tooltip", tooltip)}
          >
            <i className="fa fa-question-circle text-secondary ml-2"></i>
          </OverlayTrigger>
        </label> :
        <label htmlFor={name}>{label}</label>
      }
      <select {...rest} id={name} name={name} className="form-control" disabled={disabled}>
        {options.map((option) => (
          <option key={option} value={option} selected={option===currentOption}>
            {option}
          </option>
        ))}
      </select>
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default Select;
