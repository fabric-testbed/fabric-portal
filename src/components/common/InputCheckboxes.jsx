import React from "react";

const InputCheckboxes = props => {
  const { allOptions, selectedOptions, onCheck, showSelectAll, optionDirection } = props;

  return ( 
    <div className={`w-100 mt-2 d-flex flex-${optionDirection}`}>
      {
        showSelectAll &&  <div className="form-check mb-2 mr-2">
          <input
            className="form-check-input"
            type="checkbox"
            value=""
            id={"selectAll"}
            defaultChecked={selectedOptions.length === allOptions.length}
            onClick={() => onCheck("all")}
          />
          <label className="form-check-label">
            Select All
          </label>
        </div>
      }
      {
        allOptions.map(option =>
        <div className="form-check mb-2 mr-3" key={option}>
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
