import React from "react";

class InputTag extends React.Component {
  removeTag = (i) => {
    const newTags = [...this.state.tags];
    newTags.splice(i, 1);
    this.setState({ tags: newTags });
  };

  inputKeyDown = (e) => {
    const val = e.target.value;
    if (e.key === "Enter" && val) {
      if (
        this.state.tags.find((tag) => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      this.setState({ tags: [...this.state.tags, val] });
      this.tagInput.value = null;
    } else if (e.key === "Backspace" && !val) {
      this.removeTag(this.state.tags.length - 1);
    }
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
                  className="fa fa-times ml-2"
                  onClick={() => {
                    this.removeTag(i);
                  }}
                ></i>
              </li>
            ))}
            <li className="input-tag__tags__input">
              <input
                type="text"
                onKeyDown={this.inputKeyDown}
                ref={(c) => {
                  this.tagInput = c;
                }}
              />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default InputTag;
