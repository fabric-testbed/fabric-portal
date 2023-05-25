import React from "react";
import DeleteModal from "../common/DeleteModal";
import { deleteKey } from "../../services/sshKeyService";
import toLocaleTime from "../../utils/toLocaleTime";
import { toast } from "react-toastify";

const content = [
  { path: "comment", label: "Name", parse: false },
  { path: "created_on", label: "Create Date", parse: true },
  { path: "expires_on", label: "Expiration Date", parse: true },
  { path: "description", label: "Description", parse: false },
  { path: "fingerprint", label: "Fingerprint", parse: false },
  { path: "ssh_key_type", label: "SSH Key Type", parse: false },
]

const generatePublicKey = (data) => {
  return JSON.stringify(`${data.ssh_key_type} ${data.public_key} ${data.comment}`, undefined, 4);
}

const handleDelete = async (uuid, type) => {
  try {
    await deleteKey(uuid);
    localStorage.setItem("sshKeyType", type === "bastion" ? "Bastion" : "Sliver");
    window.location.reload();
    toast.success("Successfully deleted.");
  }
  catch (err) {
    toast.error("Failed to delete the ssh key.");
  }
};

const KeyCard = ({ data, disableKeyDelete }) => {
  return (
    <div className="card border-primary mr-1 mb-4 key-card">
      <div className="card-body">
        {
          content.map((row, index) => {
            return (
              <div className="mb-2" key={`${row.key_uuid}-key-card-${index}`}>
                <b>{row.label}</b>: {row.parse ? toLocaleTime(data[row.path]) : data[row.path]}
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
            download={`${data.comment}.pub`}
          >
            <i className="fa fa-key"></i> Download Public Key
          </a>
          {
            !disableKeyDelete && 
            <DeleteModal
              name={"Delete SSH Key"}
              text={`Are you sure you want to delete the key ${data.comment}? This process cannot be undone.`}
              id={`delete-ssh-key-${data.uuid}`}
              onDelete={() => handleDelete(data.uuid, data.fabric_key_type)}
            />
          }
        </div>
      </div>
    </div>
  );
};

export default KeyCard;
