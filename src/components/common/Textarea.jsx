import React from "react";

const Textarea = ({ name, label, error, disabled, ...rest }) => {
  return (
    <div className="form-group">
      <label htmlFor={name}>{label}</label>
      <textarea {...rest} id={name} name={name} className="form-control" disabled={disabled}/>
      {error && <div className="alert alert-danger">{error}</div>}
    </div>
  );
};

export default Textarea;
