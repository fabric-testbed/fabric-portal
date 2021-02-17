import React from "react";

class Modal extends React.Component {

  render() {
    const { id, title, link, content } = this.props;
    return (
      <div>
        <button
          type="button"
          className="btn btn-primary"
          data-toggle="modal"
          data-target={`#${id}`}
        >
          Request to be Project Lead
        </button>
        <div
          className="modal fade"
          id={id}
          tabindex="-1"
          role="dialog"
          aria-labelledby={`${id}-title`}
          aria-hidden="true"
        >
          <div className="modal-dialog modal-dialog-centered" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id={`${id}-title`}>
                  {title}
                </h5>
                <button
                  type="button"
                  className="close"
                  data-dismiss="modal"
                  aria-label="Close"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                {content}
              </div>
              <div className="modal-footer">
                <a href={link}>
                  <button type="button" className="btn btn-primary">
                    Next
                  </button>
                </a>
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
    )
  }
}

export default Modal;
