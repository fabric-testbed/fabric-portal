import React from "react";

class InputTag extends React.Component {
  state = {
    input: "",
  };

  raiseRemoveTag = (i) => {
    const newTags = [...this.props.tags];
    newTags.splice(i, 1);
    this.props.onTagChange(newTags);
  };

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter" || e.key ===",") && val) {
      if (
        this.props.tags.find((tag) => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      e.preventDefault();
      const newTags = [...this.props.tags];
      newTags.push(val);
      this.props.onTagChange(newTags);
      this.setState({ input: "" });
    } else if (e.key === "Backspace" && !val) {
      this.raiseRemoveTag(this.props.tags.length - 1);
    }
  };

  updateInput = (e) => {
    this.setState({ input: e.target.value });
  };

  render() {
    const { name, label, tags } = this.props;
    return (
      <div className="form-group">
        <label htmlFor={name}>{label}</label>
        <div className="input-tag form-control">
          <ul className="input-tag__tags">
            {tags.map((tag, i) => (
              <li key={tag}>
                {tag}
                <i
                  className="fa fa-times ms-2"
                  onClick={() => {
                    this.raiseRemoveTag(i);
                  }}
                ></i>
              </li>
            ))}
            <li className="input-tag__tags__input">
              <input
                type="text"
                value={this.state.input}
                onChange={(e) => this.updateInput(e)}
                onKeyDown={this.raiseInputKeyDown}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default InputTag;
