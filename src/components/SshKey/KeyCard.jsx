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
  const openssh = {
    "public_openssh": `${data.name} ${data.public_key} ${data.comment}`
  }
  
  return JSON.stringify(openssh, undefined, 4);
}

const handleDelete = async (uuid) => {
  try {
    await deleteKey(uuid);
    window.location.reload();
    toast.success("Successfully deleted.");
  }
  catch (ex) {
    console.log("Failed to delete the ssh key: " + ex.response.data);
    toast.error("Failed to delete the ssh key.");
  }
};

const KeyCard = ({ data, ...rest }) => {
  return (
    <div className="card border-primary mr-2 mb-4 key-card">
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
        <a
          className="btn btn-sm btn-outline-primary mt-2 mr-3"
          href={`data:text/json;charset=utf-8,${encodeURIComponent(
            generateKeyJson(data)
          )}`}
          download={`${data.comment}.json`}
        >
          <i class="fa fa-key"></i> Download Public Key
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
