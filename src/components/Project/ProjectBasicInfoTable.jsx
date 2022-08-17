import React, { Component } from "react";
import DeleteModal from "../common/DeleteModal";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";

class ProjectBasicInfoTable extends Component {
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
    const { project, canUpdate, onDeleteProject } = this.props;
    return (
      <div className="table-responsive">
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
                { this.renderTags(project.tags) }
              </td>
            </tr>
            <tr>
              <td>Created Time</td>
              <td>{ toLocaleTime(project.created) }</td>
            </tr>
            <tr>
              <td>Creator Name</td>
              <td>{ project.project_creators[0].name }</td>
            </tr>
            <tr>
              <td>Creator Email</td>
              <td>{ project.project_creators[0].email }</td>
            </tr>
            <tr>
              <td>Creator ID</td>
              <td>{ project.project_creators[0].uuid }</td>
            </tr>    
            {
              canUpdate && 
              <tr>
                <td>Danger Zone</td>
                <td>
                  <DeleteModal
                    name={"Delete Project"}
                    text={"Are you sure you want to delete the project? This process cannot be undone."}
                    onDelete={() => onDeleteProject(project)}
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
