import React from "react";

const Checkbox = ({ label, id, isChecked }) => {
  return (
    <div className="form-check">
      <input className="form-check-input" type="checkbox" value="" id={ id } checked={ isChecked }/>
      <label className="form-check-label" for="flexCheckDefault">
        { label }
      </label>
    </div>
  );
};

export default Checkbox;
