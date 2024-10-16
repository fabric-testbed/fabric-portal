import React, { useState } from "react";
import { TagsInput } from "react-tag-input-component-2";

const ProjectTopics = (topics, onTopicsUpdate) => {
  const [selected, setSelected] = useState(topics);

  return (
    <div>
      <h1>Project Topics</h1>
      <TagsInput
        value={selected}
        onChange={setSelected.then(selected => onTopicsUpdate(selected))}
        name="topics"
        placeHolder="enter topics"
      />
      <em>press enter to add new tag</em>
    </div>
  );
};

export default ProjectTopics;