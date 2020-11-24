import React from "react";

// interface
// values: array of object
// (each obj contains string: display, value and boolean isActive)
// onChange: function

const RadioBtnGroup = ({ values, onChange, ...rest }) => {
  return (
    <div>
      {values.map((item, index) => {
        return (
          <div
            className="form-check-inline mr-4"
            key={`radio-btn-${index}`}
            onClick={() => onChange(item.value)}
          >
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                name="radio"
                value={item.value}
                checked={item.isActive}
                onChange={() => null}
              />
              {item.display}
            </label>
          </div>
        );
      })}
    </div>
  );
};

export default RadioBtnGroup;
