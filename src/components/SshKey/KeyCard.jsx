import React from "react";

const content = [
  { path: "comment", label: "Name" },
  { path: "created_on", label: "Create Date" },
  { path: "expires_on", label: "Expiration Date" },
  { path: "description", label: "Description" },
  { path: "fingerprint", label: "Fingerprint" },
  { path: "name", label: "Type" },
  { path: "public_key", label: "Public Key"},
]

const KeyCard = ({ data, ...rest }) => {
  return (
    <div className="homepage-card card">
      <div className="card-body py-2">
        {
          content.map((row, index) => {
            return (
              <p>
                {row.label} : {data[row.path]}
              </p>
            )
          })
        }
        <a href="#" class="btn btn-outline-primary">Download</a>
        <a href="#" class="btn btn-outline-primary">Delete</a>
      </div>
    </div>
  );
};

export default KeyCard;
