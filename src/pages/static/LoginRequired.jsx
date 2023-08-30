import React from "react";
import { Link } from "react-router-dom";

const LoginRequired = () => {
  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-2">{`Please log in to use full features of FABRIC Portal.`}</h1>
        <Link to="/login">
          <button className="btn btn-outline-primary mt-4 btn-sm">
            <i className="fa fa-sign-in mr-2"></i>
            Log In
          </button>
        </Link>
      </div>
    </div>
  );
};

export default LoginRequired;
