import React from "react";
import { X } from "lucide-react";
import SelectGroup from "../common/SelectGroup";

function ProjectTags({ name, label, tags, baseOptions, optionsMapping, onTagChange }) {
  const handleTagAdd = (newTag) => {
    onTagChange([...tags, newTag]);
  };

  const handleTagDelete = (tagToDelete) => {
    onTagChange(tags.filter(tag => tag !== tagToDelete));
  };

  return (
    <div htmlFor={`project-tags-${name}`} className="my-3 py-2 border-top border-bottom">
      <div className="fw-bold mb-2">{label}</div>
      <SelectGroup
        name={"Project Permissions"}
        tags={tags}
        baseOptions={baseOptions}
        optionsMapping={optionsMapping}
        onTagAdd={handleTagAdd}
      />
      <ul className="input-tag__tags">
        {tags.length > 0 &&
          tags.map(tag => (
            <li key={`project-tag-${tag}`}>
              {tag}
              <X size={14} className="ms-2 cursor-pointer" onClick={() => handleTagDelete(tag)} />
            </li>
          ))}
      </ul>
    </div>
  );
}

export default ProjectTags;
