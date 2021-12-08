import React from "react";
import DeleteModal from "../common/DeleteModal";
import { deleteKey } from "../../services/sshKeyService";
import userTimezone from "../../utils/userTimezone";
import { toast } from "react-toastify";

const content = [
  { path: "comment", label: "Name", parse: false },
  { path: "created_on", label: "Create Date", parse: true },
  { path: "expires_on", label: "Expiration Date", parse: true },
  { path: "description", label: "Description", parse: false },
  { path: "fingerprint", label: "Fingerprint", parse: false },
  { path: "name", label: "Type", parse: false },
]

const generatePublicKey = (data) => {
  return JSON.stringify(`${data.name} ${data.public_key} ${data.comment}`, undefined, 4);
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

const KeyCard = ({ data }) => {
  return (
    <div className="card border-primary mr-2 mb-4 key-card">
      <div className="card-body">
        {
          content.map((row, index) => {
            return (
              <div className="mb-2" key={`${row.key_uuid}-key-card-${index}`}>
                <b>{row.label}</b>: {row.parse ? userTimezone(data[row.path]) : data[row.path]}
              </div>
            )
          })
        }
        <div className="d-flex flex-row mt-2">
          <a
            className="btn btn-sm btn-outline-primary mr-3"
            href={`data:text/json;charset=utf-8,${encodeURIComponent(
              generatePublicKey(data).replace(/^"(.*)"$/, '$1')
            )}`}
            download={`${data.comment}.json`}
          >
            <i class="fa fa-key"></i> Download Public Key
          </a>
          <DeleteModal
            name={"Delete SSH Key"}
            text={"Are you sure you want to delete the key? This process cannot be undone."}
            onDelete={() => handleDelete(data.key_uuid)}
          />
        </div>
      </div>
    </div>
  );
};

export default KeyCard;
