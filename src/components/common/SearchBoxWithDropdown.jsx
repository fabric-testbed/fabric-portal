import React from "react";

const SearchBoxWithDropdown = ({ value, placeholder, onChange }) => {
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
          Name
        </button>
        <div className="dropdown-menu">
          <span className="dropdown-item">Project Creator</span>
          <span className="dropdown-item">Description</span>
          <span className="dropdown-item">Facility</span>
        </div>
      </div>
      <input
        type="text"
        name="query"
        className="form-control"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.currentTarget.value)}
      />
    </div>
  );
};

export default SearchBoxWithDropdown;
