import React from "react";

const SearchBoxWithDropdown = ({ activeDropdownVal, dropdownValues, value, placeholder, onDropdownChange, onInputChange, onSearch }) => {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && onSearch) {
      onSearch(e.currentTarget.value);
    }
  };

  return (
    <div className="input-group my-3">
      <div className="input-group-prepend">
        <button
          className="btn btn-outline-primary project-search-dropdown dropdown-toggle"
          type="button"
          data-bs-toggle="dropdown"
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
        onKeyDown={handleKeyDown}
      />
      {onSearch && (
        <button
          className="btn btn-outline-primary"
          type="button"
          onClick={() => onSearch(value)}
        >
          Search
        </button>
      )}
    </div>
  );
};

export default SearchBoxWithDropdown;
