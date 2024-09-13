import React, { Component } from "react";
import { Link } from "react-router-dom";
import Table from "../common/Table";
import _ from "lodash";
import shortenStr from "../../utils/shortenStr";

class ProjectsTable extends Component {
  columns = {
    "private":   [
      {
        path: "name",
        label: "Name",
        content: (project) => (
          <Link to={`/projects/${project.uuid}`}>{project.name}</Link>
        ),
      },
      { 
        path: "description",
        label: "Description",
        content: (project) => (
          <span>
            {shortenStr(this.getTextfromHTML(project.description), 200)}
          </span>
        )
      },
      {
        path: "communities",
        label: "Community",
        content: (project) => (
          <span>
            {project.communities.map((community, index) => {
              return <span
                className="badge badge-pill badge-primary mr-1"
                key={`project-community-${index}`}
              >
                {community}
              </span>
            })}
          </span>
        )
      },
      {
        path: "expires_on",
        label: "Expiration",
        content: (project) => (
          <span>{project.expires_on ? project.expires_on.split(" ")[0] : ""}</span>
        )
      }
    ],
    "public":   [
      {
        path: "name",
        label: "Name",
        content: (project) => (
          <Link to={`/experiments/public-projects/${project.uuid}`}>{project.name}</Link>
        ),
      },
      { 
        path: "description",
        label: "Description",
        content: (project) => (
          <span>
          {shortenStr(this.getTextfromHTML(project.description), 200)}
          </span>
        )
      },
      {
        path: "communities",
        label: "Community",
        content: (project) => (
          <span>
            {project.communities.map((community, index) => {
              return <span
                className="badge badge-pill badge-primary mr-1"
                key={`project-community-${index}`}
              >
                {community}
              </span>
            })}
          </span>
        )
      },
      {
        content: (project) => (
          <Link to={`/experiments/public-projects/${project.uuid}`}>
            <button className="btn btn-sm btn-outline-primary">
              View
            </button>
          </Link>
        ),
      }
    ]
  }

  getTextfromHTML = (htmlStr) => {
    return new DOMParser()
    .parseFromString(htmlStr, "text/html")
    .documentElement.textContent;
  }

  render() {
    const { projects, isPublic } = this.props;
  
    return (
      <Table
        columns={isPublic ? this.columns["public"] : this.columns["private"]}
        data={projects}
        style={"table-md"}
      />
    );
  }
}

export default ProjectsTable;
