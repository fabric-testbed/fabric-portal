import React, { useState } from "react";
import { X } from "lucide-react";

const ProjectTopics = ({ name, label, tags, disabled, onTagChange }) => {
  const [input, setInput] = useState("");

  const raiseRemoveTag = (i) => {
    const newTags = [...tags];
    newTags.splice(i, 1);
    onTagChange(newTags);
  };

  const raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter" || e.key ===",") && val) {
      if (
        tags.find((tag) => tag.toLowerCase() === val.toLowerCase())
      ) {
        return;
      }
      e.preventDefault();
      const newTags = [...tags];
      newTags.push(val);
      onTagChange(newTags);
      setInput("");
    } else if (e.key === "Backspace" && !val) {
      raiseRemoveTag(tags.length - 1);
    }
  };

  return (
    <div className="form-group mt-2 mb-3">
      <h5 htmlFor={name}>{label}</h5>
       { !disabled ?
        <div className="input-tag form-control">
          <ul className="input-tag__tags">
            {
              tags.length > 0 && tags.map((tag, i) => (
                <li key={tag}>
                  {tag}
                  <X size={14} className="ms-2 cursor-pointer" onClick={() => raiseRemoveTag(i)} />
                </li>
              ))
            }
            <li className="input-tag__tags__input">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={raiseInputKeyDown}
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
};

export default ProjectTopics;
