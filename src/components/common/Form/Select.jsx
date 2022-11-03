import React from "react";

const Select = ({ name, label, currentOption, options, error, disabled, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
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
