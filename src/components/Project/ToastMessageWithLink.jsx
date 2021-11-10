import React from "react";
import { Link } from "react-router-dom";

const ToastMessageWithLink = ({project}) => {
  return (
    <div>
      <Link to={`/projects/${project.uuid}`}>Click to view the new project: {project.name}</Link>
    </div>
  )
}

export default ToastMessageWithLink;
