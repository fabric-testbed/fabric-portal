import React from "react";

class DeleteModal extends React.Component {
  render() {
    const { name, text, onDelete } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn btn-sm btn-outline-danger"
          data-toggle="modal"
          data-target="#deleteModal"
        >
          <i class="fa fa-trash"></i> {name}
        </button>
        <div
          className="modal fade"
          id="deleteModal"
          tabindex="-1"
          role="dialog"
          aria-labelledby="deleteModalTitle"
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
                  className="btn btn-danger"
                  data-dismiss="modal"
                >
                  Confirm
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
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
