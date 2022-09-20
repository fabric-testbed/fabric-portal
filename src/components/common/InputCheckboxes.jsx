import React from "react";

const InputCheckboxes = props => {
  const { allOptions, selectedOptions, onCheck } = props;

  return ( 
    <div className="form-check">
      {
        allOptions.map(option =>
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={option}
            defaultChecked={selectedOptions.includes(option)}
            onClick={() => onCheck(option)}
          />
          <label className="form-check-label">
            { option }
          </label>
        </div>
        )
      }
    </div>
  );
};

export default InputCheckboxes;
