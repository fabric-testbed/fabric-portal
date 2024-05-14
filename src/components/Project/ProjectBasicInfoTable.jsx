import React, { Component } from "react";
import moment from 'moment';
import DeleteModal from "../common/DeleteModal";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import Calendar from "../../components/common/Calendar";
import Funding from "./Community/Funding.jsx";
import CommunityTags from "./Community/CommunityTags.jsx";
import { toast } from "react-toastify";
import { default as portalData } from "../../services/portalData.json";
import sleep from "../../utils/sleep";
import { updateProjectExpirationTime } from "../../services/projectService";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

class ProjectBasicInfoTable extends Component {
  state = {
    expirationTime: this.props.project.expired,
    fabricMatrixTooltip: "Insert the link of the FABRIC Matrix slide including the current state, approach, challenges and impact of this project."
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

  handleExpirationTimeChange = (value) => {
    const inputTime = moment(value).format();
    // input format e.g. 2022-05-25T10:49:03-04:00
    // output format should be 2022-05-25 10:49:03 -0400
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");
    this.setState({ expirationTime: outputTime });
  }

  handleSetExpiration = async () => {
    this.setState({
      showSpinner: true,
      spinnerText: "Updating project expiration time..."
    })
    try {
      await updateProjectExpirationTime(this.props.project.uuid, this.state.expirationTime);
      // toast message to users when the api call is successfully done.
      toast.success("Project expiration time updated successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update project expiration time.");
      this.setState({
        leaseEndTime: this.props.project.expired,
        showSpinner: false,
        spinnerText: ""
      });
    }
  }

  renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );


  render() {
    const { project, projectTags, canUpdate, onDeleteProject, isFO, projectFunding, 
      communities, fabricMatrix, fabricMatrixTooltip } = this.props;
    return (
      <div>
        <div className="form-group">
          <label htmlFor={"fabrix-matrix"}>
            FABRIC Matrix
              <OverlayTrigger
                placement="right"
                delay={{ show: 100, hide: 300 }}
                overlay={this.renderTooltip("fabrix-matrix", fabricMatrixTooltip)}
              >
                <i className="fa fa-question-circle text-secondary ml-2"></i>
              </OverlayTrigger>
          </label>
          <input
            className="form-control"
            value={fabricMatrix}
            onChange={() => this.props.onMatrixChange}
          />
        </div>
        <Funding
          fundings={projectFunding}
          canUpdate={canUpdate}
          onFundingUpdate={this.props.onFundingUpdate}
        />
        <CommunityTags
          communities={communities}
          canUpdate={canUpdate}
          onCommunityUpdate={this.props.onCommunityUpdate}
        />
        {
          canUpdate && 
          <button
            className="btn btn-md btn-primary mt-2"
            onClick={this.props.onUpdateProject}
          >
            Save
          </button>
        }
        <div className="table-responsive mt-3">
        {
          project && project.expired && 
          <table className="table table-striped table-bordered mt-4">
            <tbody>
              <tr>
                <td>Project ID</td>
                <td>
                  <span className="mr-2">{ project.uuid }</span>
                  <CopyButton
                    id={project.uuid}
                    text=""
                    showCopiedValue={true}
                    btnStyle={"btn btn-sm btn-primary"}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Project Permissions <a
                  href={`${portalData.learnArticles.guideToProjectPermissions}#project-permissions`}
                  target="_blank" rel="noreferrer" className="ml-1">
                    <i className="fa fa-question-circle mx-2"></i>
                  </a>
                </td>
                <td>
                  { projectTags.length > 0 ? this.renderTags(projectTags) : "No permissions assigned" }
                </td>
              </tr>
              <tr>
                <td>Expiration Date</td>
                <td>
                  {
                    isFO ? 
                    <div className="d-flex justify-content-between align-items-center">
                      <Calendar
                        id="projectExpirationCalendar"
                        name="projectExpirationCalendar"
                        onTimeChange={this.handleExpirationTimeChange}
                        parent={"ProjectForm"}
                        currentTime={new Date(utcToLocalTimeParser(project.expired).replace(/-/g, "/"))}
                      />
                      <button
                        className="btn btn-sm btn-primary"
                        onClick={this.handleSetExpiration}
                      >
                        Update
                      </button>
                    </div>
                    :
                    toLocaleTime(project.expired)
                  }
                </td>
              </tr>
              <tr>
                <td>Modified Time</td>
                <td>{ toLocaleTime(project.modified) }</td>
              </tr>
              <tr>
                <td>Created At</td>
                <td>{ toLocaleTime(project.created) }</td>
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
              {
                canUpdate && 
                <tr>
                  <td>Danger Zone</td>
                  <td>
                    <DeleteModal
                      name={"Delete Project"}
                      text={"Are you sure you want to delete the project? This process cannot be undone."}
                      id={"delete-project"}
                      onDelete={() => onDeleteProject(project)}
                    />
                  </td>
                </tr>
              }
            </tbody>
          </table>
        }
      </div> 
      </div>
    );
  }
}

export default ProjectBasicInfoTable;
