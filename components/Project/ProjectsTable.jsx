import React from "react";
import Link from "next/link";
import Table from "../common/Table";
import shortenStr from "../../utils/shortenStr";
import Badge from 'react-bootstrap/Badge';

function ProjectsTable({ projects, isPublic }) {
  const getTextfromHTML = (htmlStr) => {
    return new DOMParser()
    .parseFromString(htmlStr, "text/html")
    .documentElement.textContent;
  };

  const columns = {
    "private":   [
      {
        path: "name",
        label: "Name",
        style: { width: "18%" },
        content: (project) => (
          <Link href={`/projects/${project.uuid}`}>{project.name}</Link>
        ),
      },
      {
        path: "description",
        label: "Description",
        style: { width: "36%" },
        content: (project) => (
          <span>
            {shortenStr(getTextfromHTML(project.description), 200)}
          </span>
        )
      },
      {
        path: "communities",
        label: "Community",
        style: { width: "32%" },
        content: (project) => (
          <span>
            {project.communities.map((community, index) => {
              return (<Badge
                bg="primary"
                key={`project-community-${index}`}
                className="me-1 mb-1"
                style={{ whiteSpace: "normal", wordBreak: "break-word" }}
              >
                {community}
              </Badge>)
            })}
          </span>
        )
      },
      {
        path: "expires_on",
        label: "Expiration",
        style: { width: "14%" },
        content: (project) => (
          <span>{project.expires_on ? project.expires_on.split(" ")[0] : ""}</span>
        )
      }
    ],
    "public":   [
      {
        path: "name",
        label: "Name",
        style: { width: "22%" },
        content: (project) => (
          <Link href={`/experiments/public-projects/${project.uuid}`}>{project.name}</Link>
        ),
      },
      {
        path: "description",
        label: "Description",
        style: { width: "42%" },
        content: (project) => (
          <span>
          {shortenStr(getTextfromHTML(project.description), 200)}
          </span>
        )
      },
      {
        path: "communities",
        label: "Community",
        style: { width: "28%" },
        content: (project) => (
          <span>
            {project.communities.map((community, index) => {
              return (<Badge
                bg="primary"
                className="me-1 mb-1"
                style={{ whiteSpace: "normal", wordBreak: "break-word" }}
                key={`project-community-${index}`}>
                  {community}
                </Badge>)
            })}
          </span>
        )
      },
      {
        style: { width: "8%" },
        content: (project) => (
          <Link href={`/experiments/public-projects/${project.uuid}`}>
            <button className="btn btn-sm btn-outline-primary">
              View
            </button>
          </Link>
        ),
      }
    ]
  };

  return (
    <Table
      columns={isPublic ? columns["public"] : columns["private"]}
      data={projects}
      tStyle={"table-md"}
      tTableStyle={{ tableLayout: "fixed", width: "100%" }}
    />
  );
}

export default ProjectsTable;
