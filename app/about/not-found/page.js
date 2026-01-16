import React from "react";
import Link from "next/link";

const NotFound = () => {
  return (
    <div className="container d-flex flex-row align-items-center justify-content-center">
      <img src="/imgs/network-bg.svg" alt={`static page background`} className="static-page-bg"/>
      <div className="d-flex flex-column align-items-center">
        <h1 className="fw-semibold lh-1">{`Ooops, page not found :( `}</h1>
        <p className="lead my-3">
          We looked everywhere for this page but couldn't find it.
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

export default NotFound;
