import React from "react";

const SearchBoxWithBtn = ({ value, placeholder, onChange, onSearch }) => {
  return (
    <div className="input-group mb-3">
      <input
          type="text"
          name="query"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.currentTarget.value)}
        />
      <div className="input-group-append">
        <button
          className="btn btn-outline-secondary"
          type="button"
          onClick={(e) => onSearch()}
        >
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBoxWithBtn;
