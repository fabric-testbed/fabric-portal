import React from "react";

const Select = ({ name, label, currentOptionName, options, error, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      {
        currentOptionName && 
        <select {...rest} id={name} name={name} className="form-control">
            <option key={currentOptionName} value={currentOptionName}>
              {currentOptionName}
            </option>
        </select>
      }

      {
        !currentOptionName && 
        <select {...rest} id={name} name={name} className="form-control">
          <option value="" />
          {options.map((option) => (
            <option key={option.name} value={option.name}>
              {option.name}
            </option>
          ))}
      </select>
      }
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Select;
