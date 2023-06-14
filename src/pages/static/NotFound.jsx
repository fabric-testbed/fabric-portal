import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-1">{`Ooops, page not found :( `}</h1>
        <p className="lead my-3">
          We looked everywhere for this page but couldn't find it.
        </p>
        <Link to="/">
          <button className="btn btn-outline-primary mt-4 btn-sm">
            <i className="fa fa-sign-in mr-2"></i>
            Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
