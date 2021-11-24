import React from "react";
import { deleteKey } from "../../services/sshKeyService";
import { toast } from "react-toastify";

const content = [
  { path: "comment", label: "Name" },
  { path: "created_on", label: "Create Date" },
  { path: "expires_on", label: "Expiration Date" },
  { path: "description", label: "Description" },
  { path: "fingerprint", label: "Fingerprint" },
  { path: "name", label: "Type" },
]

const handleDelete = async (uuid) => {
  try {
    await deleteKey(uuid);
    window.location.href = "/experiments#sshKeys";
    toast.success("Successfully deleted.");
  }
  catch (ex) {
    console.log("Failed to delete the ssh key: " + ex.response.data);
    toast.error("Failed to delete the ssh key.");
  }
};


const KeyCard = ({ data, ...rest }) => {
  return (
    <div className="card border-primary w-45 mr-2">
      <div className="card-body">
        {
          content.map((row, index) => {
            return (
              <div className="mb-2" key={`${row.key_uuid}-key-card-${index}`}>
                <b>{row.label}</b>: {data[row.path]}
              </div>
            )
          })
        }
        <div className="mb-2">
          <b>Public Key</b>:
          <a
            data-toggle="collapse"
            href={`#keyCardCollapse${data.key_uuid}`}
            role="button"
            aria-expanded="false"
            aria-controls={`keyCardCollapse${data.key_uuid}`}
            className="ml-2"
          >
            Click to view the public key <i class="fa fa-key"></i>
          </a>
          <div className="collapse" id={`keyCardCollapse${data.key_uuid}`}>
            {data.public_key}
          </div>
        </div>
        <a href="#" className="btn btn-sm btn-outline-primary mt-2 mr-3">Download</a>
        <button href="#" className="btn btn-sm btn-outline-danger mt-2" onClick={() => handleDelete(data.key_uuid)}>Delete</button>
      </div>
    </div>
  );
};

export default KeyCard;
