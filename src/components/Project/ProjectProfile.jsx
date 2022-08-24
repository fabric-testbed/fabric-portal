import React, { Component } from "react";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";
import _ from "lodash";
import { Link } from "react-router-dom";

class ProjectProfile extends Component {
  state = {
    basicInfoRows: [
      { label: "Description", path: "description" },
      { label: "Facility", path: "facility" },
      { label: "Modified Time", path: "modified" },
      { label: "Created Time", path: "created" },
      { label: "Creator Name", path: "creator_name" },
      { label: "Creator Email", path: "creator_email" },
      { label: "Creator ID", path: "creator_id" }
    ]
  }

  renderTags(tags) {
    return <ul className="input-tag__tags">
      {
        tags && tags.length > 0 && tags.map((tag, index) => 
          <li key={`project-tag-${index}`}>
            {tag}
          </li>
        )
      }
    </ul>;
  }

  render() {
    const { basicInfoRows } = this.state;
    const { project } = this.props;
    return (
      <div>
        <div className="d-flex flex-row justify-content-between">
          <h1>{project.name}</h1>
          <Link to="/projects">
            <button
              className="btn btn-sm btn-outline-primary my-3"
            >
              <i className="fa fa-sign-in mr-2"></i>
              Back to Project List
            </button>
          </Link>
        </div>
        <table className="table table-striped table-bordered mt-4">
          <tbody>
            <tr>
              <td>Project ID</td>
              <td>
                <span className="mr-2">{ project.uuid }</span>
                <CopyButton id={project.uuid} text=""/>
              </td>
            </tr>
            <tr>
              <td>
                Project Tags <a href="https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions/#project-permissions" target="_blank" rel="noreferrer" className="ml-1">
                  <i className="fa fa-question-circle mx-2"></i>
                </a>
              </td>
              <td>
                { project.tags.length > 0 ? this.renderTags(project.tags) : "No tag" }
              </td>
            </tr>
            {basicInfoRows.map((row, index) => {
                return (
                  <tr key={`project-basic-info-${index}`}>
                    <td>
                      {row.label}
                    </td>
                    <td className="project-detail-form-td">
                      {
                        row.path === "created" && toLocaleTime(_.get(project, row.path))
                      }
                      {
                        row.path !== "created" && _.get(project, row.path) 
                      }
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProjectProfile;