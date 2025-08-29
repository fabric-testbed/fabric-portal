import React from "react";

const Checkbox = ({ label, id, isChecked, onCheck }) => {
  return (
    <div className="form-check">
      <input
        className="form-check-input"
        type="checkbox"
        value=""
        id={ id }
        defaultChecked={ isChecked }
        onClick={ onCheck }
      />
      <label className="form-check-label">
        { label }
      </label>
    </div>
  );
};

export default Checkbox;
