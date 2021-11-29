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

const generateKeyJson = (data) => {
  const res_json = {
    "name": data.comment,
    "Create Date": data.created_on,
    "Expiration Date": data.expired_on,
    "Description": data.description,
    "Fingerprint": data.fingerprint,
    "Type": data.type,
    "Public Key": data.public_key
  };
  
  return JSON.stringify(res_json, undefined, 4);
}

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
            Click to view or hide the public key <i class="fa fa-key"></i>
          </a>
          <div className="collapse public-key-collapse" id={`keyCardCollapse${data.key_uuid}`}>
            {data.public_key}
          </div>
        </div>
        <a
          className="btn btn-sm btn-outline-primary mt-2 mr-3"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            generateKeyJson(data)
          )}`}
          download={`${data.comment}.json`}
        >
          Download
        </a>
        <button
          className="btn btn-sm btn-outline-danger mt-2"
          onClick={() => handleDelete(data.key_uuid)}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default KeyCard;
