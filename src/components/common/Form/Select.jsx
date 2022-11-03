import React from "react";

const Select = ({ name, label, currentOptionName, options, error, disabled, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {
        currentOptionName && 
        <select {...rest} id={name} name={name} className="form-control" disabled={disabled}>
            <option key={currentOptionName} value={currentOptionName}>
              {currentOptionName}
            </option>
        </select>
      }

      {
        !currentOptionName && 
        <select {...rest} id={name} name={name} className="form-control" disabled={disabled}>
          <option value="" />
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
      </select>
      }
      {error && <div className="alert alert-warning">{error}</div>}
    </div>
  );
};

export default Select;
