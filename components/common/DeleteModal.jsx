import React, { useState } from "react";
import { Trash2 } from "lucide-react";

function DeleteModal({ name, text, id, onDelete }) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        type="button"
        className="btn btn-sm btn-outline-danger"
        onClick={() => setOpen(true)}
      >
        <Trash2 size={16} /> {name}
      </button>
      {open && (
        <div
          className="modal fade show d-block"
          tabIndex="-1"
          role="dialog"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          onClick={() => setOpen(false)}
        >
          <div
            className="modal-dialog modal-dialog-centered"
            role="document"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-content">
              <div className="modal-body">{text}</div>
              <div className="modal-footer">
                <button
                  onClick={() => { onDelete(); setOpen(false); }}
                  type="button"
                  className="btn btn-sm btn-danger"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  onClick={() => setOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DeleteModal;
