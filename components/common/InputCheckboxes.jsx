import React from "react";

const InputCheckboxes = props => {
  const { allOptions, selectedOptions, onCheck,
    showSelectAll, optionDirection, disabled, optionsDisplayMapping } = props;

  return ( 
    <div className={`w-100 mt-2 d-flex flex-${optionDirection} flex-wrap`}>
      {
        showSelectAll &&  <div className="form-check mb-2 me-2">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={"selectAll"}
            defaultChecked={selectedOptions.length === allOptions.length}
            onClick={() => onCheck("all")}
            disabled={disabled}
          />
          <label className="form-check-label">
            Select All
          </label>
        </div>
      }
      {
        allOptions.map(option =>
        <div className="form-check mb-2 me-3" key={option}>
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={option}
            defaultChecked={selectedOptions.includes(option)}
            onClick={() => onCheck(option)}
            disabled={disabled}
          />
          <label className="form-check-label">
            { optionsDisplayMapping ? optionsDisplayMapping[option] : option }
          </label>
        </div>
        )
      }
    </div>
  );
};

export default InputCheckboxes;
