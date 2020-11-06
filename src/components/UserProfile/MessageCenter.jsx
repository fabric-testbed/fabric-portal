import React from "react";
import { getActiveMessages } from "../../services/fakeMessages.js";
import { getTrashMessages } from "../../services/fakeMessages.js";
import RadioBtnGroup from "../common/RadioBtnGroup.jsx";

class MessageCenter extends React.Component {
  state = {
    messages: getActiveMessages(),
    messageCols: [
      { display: "Subject", field: "subject" },
      { display: "Content", field: "content" },
      { display: "Date", field: "date" },
    ],
    radioBtnValues: [
      { display: "Active", value: "active", isActive: true },
      { display: "Trash", value: "inactive", isActive: false },
    ],
  };

  toggleRadioBtn = (value) => {
    // set isActive field for radio button input style change
    this.setState((prevState) => ({
      radioBtnValues: prevState.radioBtnValues.map((el) =>
        el.value === value
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      ),
    }));
    if (value === "active") {
      this.setState({ messages: getActiveMessages() });
    } else if (value === "inactive") {
      this.setState({ messages: getTrashMessages() });
    }
  };

  render() {
    return (
      <div className="col-9">
        <h1>Message Center</h1>
        <RadioBtnGroup
          values={this.state.radioBtnValues}
          onChange={this.toggleRadioBtn}
        />
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
