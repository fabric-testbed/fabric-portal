import React from "react";
import { getMessages } from "../../services/fakeMessages.js";

class MessageCenter extends React.Component {
  state = {
    messages: getMessages(),
    messageCols: [
      { display: "Subject", field: "subject" },
      { display: "Content", field: "content" },
      { display: "Date", field: "date" },
    ],
  };

  render() {
    return (
      <div className="col-9">
        <h1>Message Center</h1>
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
