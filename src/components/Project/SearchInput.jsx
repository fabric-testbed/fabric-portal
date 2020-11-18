import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

const SearchInput = ({ name, ...rest }) => {
  return (
    <div className="d-flex flex-row my-2 w-25">
      <input {...rest} id={name} name={name} className="form-control" />
      <button className="btn btn-danger">
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </div>
  );
};

export default SearchInput;
