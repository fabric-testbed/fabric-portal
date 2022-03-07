import React from "react";

class DeleteModal extends React.Component {
  render() {
    const { name, text, id, onDelete } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          data-toggle="modal"
          data-target={`#delete-modal-${id}`}
        >
          <i className="fa fa-trash"></i> {name}
        </button>
        <div
          className="modal fade"
          id={`#delete-modal-${id}`}
          tabIndex="-1"
          role="dialog"
          aria-labelledby={`#delete-ssh-key-modal-${id}`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-body">
                {text}
              </div>
              <div className="modal-footer">
                <button
                  onClick={onDelete}
                  type="button"
                  className="btn btn-sm btn-danger"
                  data-dismiss="modal"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-secondary"
                  data-dismiss="modal"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}

export default DeleteModal;
