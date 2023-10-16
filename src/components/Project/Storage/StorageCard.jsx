import React from "react";

const content = [
  { path: "volume_name", label: "Volume Name", parse: false },
  { path: "volume_size_gb", label: "Volume Size", parse: false },
  { path: "expires_on", label: "Expiration", parse: false },
  { path: "created_on", label: "Created", parse: false },
  { path: "uuid", label: "UUID", parse: false },
  { path: "requested_by_uuid", label: "Requested By", parse: false },
  { path: "requested_by_name", label: "Requested By", parse: false },
  { path: "site_list", label: "Sites", parse: false },
]

const StorageCard = ({ data }) => {
  return (
    <div className="card border-primary mr-1 mb-4 key-card">
      <div className="card-body">
        {
          content.map((row, index) => {
            return (
              <div className="mb-2" key={`${row.uuid}-key-card-${index}`}>
                <b>{row.label}</b>: {data[row.path]}
              </div>
            )
          })
        }
      </div>
    </div>
  );
};

export default StorageCard;