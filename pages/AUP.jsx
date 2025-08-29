import React from "react";

const AUP = () => {
  return (
    <div className="container pb-5 d-flex flex-column align-items-center">
      <h1 className="mb-4">FABRIC Acceptable Use Policy</h1>
      <iframe
        title="FABRIC Acceptable Use Policy"
        className="aup-iframe"
        src="https://docs.google.com/document/d/e/2PACX-1vS2QXcWlyR_d5P3dm_UaujkxpmIgGUWG1KSGaUt7s1PP8Jw62rQmxzcVUNlZ1z8n4H8bfNGpYlh6vVl/pub?embedded=true"
      />
    </div>
  );
};

export default AUP;
