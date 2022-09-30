import React from "react";

const InputCheckboxes = props => {
  const { allOptions, selectedOptions, onCheck } = props;

  return ( 
    <div className="w-100 mt-2">
      {
        allOptions.map(option =>
        <div className="form-check mb-2">
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
