import React from "react";
import { getActiveMessages } from "../../services/fakeMessages.js";
import { getTrashMessages } from "../../services/fakeMessages.js";

class MessageCenter extends React.Component {
  state = {
    messages: getActiveMessages(),
    messageCols: [
      { display: "Subject", field: "subject" },
      { display: "Content", field: "content" },
      { display: "Date", field: "date" },
    ],
    active: "inbox",
  };

  toggleRadioBtn = (e) => {
    if (e.target.value === "inbox") {
      this.setState({ active: "inbox" });
      this.setState({ messages: getActiveMessages() });
    } else {
      this.setState({ active: "trash" });
      this.setState({ messages: getTrashMessages() });
    }
  };

  render() {
    return (
      <div className="col-9">
        <h1>Message Center</h1>
        <div className="toolbar pt-2">
          <div className="form-check-inline mr-4">
            <label className="form-check-label">
              <input
                type="radio"
                className="form-check-input"
                name="optradio"
                value="inbox"
                checked={this.state.active === "inbox"}
                onChange={this.toggleRadioBtn}
              />
              Inbox
            </label>
          </div>
          <div className="form-check-inline"></div>
          <label className="form-check-label">
            <input
              type="radio"
              className="form-check-input"
              name="optradio"
              value="trash"
              checked={this.state.active === "trash"}
              onChange={this.toggleRadioBtn}
            />
            Trash
          </label>
        </div>
        <table className="table table-striped table-bordered my-4">
          <tbody>
            <tr>
              {this.state.messageCols.map((col, index) => {
                return (
                  <th key={`message-table-header-${index}`}>{col.display}</th>
                );
              })}
              <th>From</th>
            </tr>
            {this.state.messages.map((message, index) => {
              return (
                <tr key={`message-row-${index}`}>
                  {this.state.messageCols.map((col, index) => {
                    return (
                      <td key={`message-col-${index}`}>{message[col.field]}</td>
                    );
                  })}
                  <td>
                    <a
                      href={message.from_user_link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {message.from}
                    </a>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default MessageCenter;
