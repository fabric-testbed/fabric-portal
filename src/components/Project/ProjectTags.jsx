import React from "react";
import SelectGroup from "../common/SelectGroup";

class ProjectTags extends React.Component {
  handleTagAdd = (newTag) => {
    const newTags = [...this.props.tags];
    newTags.push(newTag);
    this.props.onTagChange(newTags);
  }

  handleTagDelete = (tagToDelete) => {
    const newTags = [];
    for (const tag of [...this.props.tags]) {
      if (tag !== tagToDelete) {
        newTags.push(tag);
      }
    }
    this.props.onTagChange(newTags);
  }

  render() {
    const { name, label, tags, baseOptions, optionsMapping } = this.props;

    return (
      <div htmlFor={`project-tags-${name}`} className="my-3 py-2 border-top border-bottom">
        <div className="font-weight-bold mb-2">{label}</div>
        <SelectGroup
          name={"Project Permissions"}
          tags={tags}
          baseOptions={baseOptions}
          optionsMapping={optionsMapping}
          onTagAdd={this.handleTagAdd}
        />
        <ul className="input-tag__tags">
          {
            tags.length > 0 && 
            tags.map(tag => <li key={`project-tag-${tag}`}>
              {tag}
            <i
              className="fa fa-times ms-2"
              onClick={() => {
                this.handleTagDelete(tag);
              }}
            ></i>
          </li>)
          }
        </ul>
      </div>
    );
  }
}

export default ProjectTags;
