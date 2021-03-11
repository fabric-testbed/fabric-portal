import React from "react";
import Topomap from "../components/Resource/Topomap"
import DetailTable from "../components/Resource/DetailTable"
import SummaryTable from "../components/Resource/SummaryTable"

const Resources = () => {
  return (
    <div className="container">
      <h1>Resources</h1>
      <div className="row">
        <div className="col-9">
          <Topomap />
        </div>
        <div className="col-3">
          <DetailTable />
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12">
          <SummaryTable />
        </div>
      </div>
    </div>
  );
};

export default Resources;
