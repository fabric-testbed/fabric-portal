import React from "react";

const SearchBoxWithDropdown = ({ activeDropdownVal, dropdownValues, value, placeholder, onDropdownChange, onInputChange }) => {
  return (
    <div className="input-group my-3">
      <div className="input-group-prepend">
        <button
          className="btn btn-outline-secondary project-search-dropdown dropdown-toggle"
          type="button"
          data-toggle="dropdown"
          aria-haspopup="true"
          aria-expanded="false"
        >
          {activeDropdownVal}
        </button>
        <div className="dropdown-menu">
          {
            dropdownValues.map(value => activeDropdownVal !== value ?
              <span
                className="dropdown-item"
                key={`project-dropdown${value}`}
                onClick={() => onDropdownChange(value)}
              >
                {value}
              </span> : null
            )
          }
        </div>
      </div>
      <input
        type="text"
        name="query"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onInputChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBoxWithDropdown;
