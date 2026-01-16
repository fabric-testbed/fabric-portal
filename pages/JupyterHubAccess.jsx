import React from "react";
import Link from "next/link";

const JupyterHubAccess = () => {
  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <img src="/imgs/network-bg.svg" alt={`static page background`} className="static-page-bg"/>
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-1">{`Ooops, you don't have access to JupyterHub.`}</h1>
        <p className="lead my-3">
          Please join at least one project first to gain JupyterHub access. If you have joined a project, please re-login to refresh access.
        </p>
        <Link href="/">
          <button className="btn btn-outline-primary mt-4 btn-sm">
            <i className="fa fa-sign-in me-2"></i>
            Homepage
          </button>
        </Link>
      </div>
    </div>
  );
};

export default JupyterHubAccess;
