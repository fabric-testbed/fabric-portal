import React, { Component } from "react";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";
import _ from "lodash";

class ProjectProfile extends Component {
  state = {
    basicInfoRows: [
      { label: "Description", path: "description" },
      { label: "Facility", path: "facility" },
      { label: "Created Time", path: "created" },
    ],
    moreInfoRows: [
      {

      }
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
    const { projectStaticInfoRows } = this.state;
    const { project } = this.props;
    return (
      <div>
        <h1>
          {project.name}
        </h1>
        <h3>Basic Information</h3>
        <table className="table table-striped table-bordered mt-4">
          <tbody>
          {projectStaticInfoRows.map((row, index) => {
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
            <tr>
              <td>Project ID</td>
              <td>
                <span className="mr-2">{ project.uuid }</span>
                <CopyButton id={project.uuid} text=""/>
              </td>
            </tr>
          </tbody>
        </table>
        <h3>
          More Information
        </h3>
        {
          project.is_public &&
          <table className="table table-striped table-bordered mt-4">
            <tr>
              <td>
                Project Tags <a href="https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions/#project-permissions" target="_blank" rel="noreferrer" className="ml-1">
                  <i className="fa fa-question-circle mx-2"></i>
                </a>
              </td>
              <td>
                { this.renderTags(project.tags) }
              </td>
            </tr>
            <tr>
              <td>Creator Name</td>
              <td>{ project.creator_name }</td>
            </tr>
            <tr>
              <td>Creator Email</td>
              <td>{ project.creator_email }</td>
            </tr>
            <tr>
              <td>Creator ID</td>
              <td>{ project.creator_id }</td>
            </tr>
          </table>
        }
      </div>
    );
  }
}

export default ProjectProfile;
