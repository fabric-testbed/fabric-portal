import React, { Component } from "react";
import DeleteModal from "../common/DeleteModal";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";
import _ from "lodash";

class ProjectBasicInfoTable extends Component {
  state = {
    projectStaticInfoRows: [
      {
        label: "Project Tags",
        path: "tags",
        link: "https://learn.fabric-testbed.net/knowledge-base/fabric-user-roles-and-project-permissions/#project-permissions"
      },
      { label: "Created Time", path: "created_time", link: "" },
      { label: "Creator Name", path: "created_by.name", link: "" },
      { label: "Creator Email", path: "created_by.email", link: "" },
      { label: "Creator ID", path: "created_by.uuid", link: "" },
    ],
  }

  renderTags(tags) {
    return <ul className="input-tag__tags">
      {
        tags.length > 0 && tags.map((tag, index) => 
          <li key={`project-tag-${index}`}>
            {tag}
          </li>
        )
      }
    </ul>;
  }

  render() {
    const { projectStaticInfoRows } = this.state;
    const { data, canUpdate, onDeleteProject } = this.props;

    return (
      <div class="table-responsive">
        <table className="table table-striped table-bordered mt-4">
          <tbody>
            <tr>
              <td>
                Project ID
              </td>
              <td>
                { _.get(data, "uuid") }
                <CopyButton id={_.get(data, "uuid")} text="" />
              </td>
            </tr>
            {projectStaticInfoRows.map((row, index) => {
              return (
                <tr key={`project-basic-info-${index}`}>
                  <td>
                    {row.label}
                    {row.link !== "" && 
                      <a href={row.link} target="_blank" rel="noreferrer" className="ml-1">
                        <i className="fa fa-question-circle mx-2"></i>
                      </a>
                    }
                  </td>
                  <td className="project-detail-form-td">
                    {}
                    {row.path === "tags" && this.renderTags(_.get(data, row.path))}
                    {row.path === "created_time" && toLocaleTime(_.get(data, row.path))}
                    {
                      row.path !== "tags" && row.path !== "created_time" &&
                      _.get(data, row.path) 
                    }
                  </td>
                </tr>
              );
            })}
            {
              canUpdate && 
              <tr>
                <td>Danger Zone</td>
                <td>
                  <DeleteModal
                    name={"Delete Project"}
                    text={"Are you sure you want to delete the project? This process cannot be undone."}
                    onDelete={() => onDeleteProject(data)}
                  />
                </td>
              </tr>
            }
          </tbody>
        </table>
      </div>
    );
  }
}

export default ProjectBasicInfoTable;
