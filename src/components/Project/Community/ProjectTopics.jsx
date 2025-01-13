import React from "react";

class ProjectTopics extends React.Component {
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
    const { name, label, tags, disabled } = this.props;
    return (
      <div className="form-group">
        <h5 htmlFor={name}>{label}</h5>
         { !disabled ?
          <div className="input-tag form-control">
            <ul className="input-tag__tags">
              { 
                tags.length > 0 && tags.map((tag, i) => (
                  <li key={tag}>
                    {tag}
                    <i
                      className="fa fa-times ms-2"
                      onClick={() => {
                        this.raiseRemoveTag(i);
                      }}
                    ></i>
                  </li>
                ))
              }
              <li className="input-tag__tags__input">
                <input
                  type="text"
                  value={this.state.input}
                  onChange={(e) => this.updateInput(e)}
                  onKeyDown={this.raiseInputKeyDown}
                />
              </li>
            </ul>
          </div> :
           <ul className="input-tag__tags">
           {
             tags.length > 0 && tags.map((tag, i) => (
               <li key={tag}>
                 {tag}
               </li>
             ))
           }
           {
            tags.length === 0 && 
            <div
              className="alert alert-primary mb-2" 
              role="alert"
            >
              This project has no project topic added yet.
            </div>
           }
           </ul>
          }
      </div> 
    );
  }
}

export default ProjectTopics;
