import React from "react";
import { Link } from "react-router-dom";

const StorageCard = ({ data }) => {
  return (
    <div className="card border-primary mr-1 mb-4 key-card">
      <div className="card-body">
        <div className="mb-2"><b>Name</b>: {data.volume_name}</div>
        <div className="mb-2"><b>Size</b>: {data.volume_size_gb}</div>
        <div className="mb-2"><b>Sites</b>: {data.site_list}</div>
        <div className="mb-2"><b>Created</b>: {data.created_on}</div>
        <div className="mb-2"><b>Expiration</b>: {data.expires_on}</div>
        <div className="mb-2">
          <b>Requested By</b>:
          <Link to={`/users/${data.requested_by_uuid}`}>
            {data.requested_by_name}
          </Link>
        </div>
        <div className="mb-2"><b>UUID</b>: {data.uuid}</div>
      </div>
    </div>
  );
};

export default StorageCard;