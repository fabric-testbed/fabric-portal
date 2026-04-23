import React, { useState, useCallback } from "react";
import moment from 'moment';
import DeleteModal from "../common/DeleteModal";
import CopyButton from "../common/CopyButton";
import toLocaleTime from "../../utils/toLocaleTime";
import utcToLocalTimeParser from "../../utils/utcToLocalTimeParser.js";
import CalendarDateTime from "../common/CalendarDateTime.jsx";
import ProjectTopics from "./Community/ProjectTopics.jsx";
import Funding from "./Community/Funding.jsx";
import CommunityTags from "./Community/CommunityTags.jsx";
import { toast } from "react-toastify";
import { default as portalData } from "../../services/portalData.json";
import sleep from "../../utils/sleep";
import { updateProjectExpirationTime } from "../../services/projectService";
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { HelpCircle } from "lucide-react";

const ProjectBasicInfoTable = ({ project, projectTags, canUpdate, onDeleteProject, isFO, projectFunding,
  communities, fabricMatrix, topics, onMatrixUpdate, onFundingUpdate, onCommunityUpdate, onTagChange, onUpdateProject }) => {
  const [expirationTime, setExpirationTime] = useState(project.expired);
  const [fabricMatrixTooltip] = useState("Insert the link of the FABRIC Matrix slide including the current state, approach, challenges and impact of this project.");

  const renderTags = (tags) => {
    return <ul className="input-tag__tags">
      {
        tags && tags.length > 0 && tags.map((tag, index) =>
          <li key={`project-tag-${index}`}>
            {tag}
          </li>
        )
      }
    </ul>;
  };

  const handleExpirationTimeChange = useCallback((value) => {
    const inputTime = moment(value).format();
    const date = inputTime.substring(0, 10);
    const time = inputTime.substring(11, 19);
    const offset = inputTime.substring(19).replace(":", "");
    const outputTime = [date, time, offset].join(" ");
    setExpirationTime(outputTime);
  }, []);

  const handleSetExpiration = async () => {
    try {
      await updateProjectExpirationTime(project.uuid, expirationTime);
      toast.success("Project expiration time updated successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update project expiration time.");
      setExpirationTime(project.expired);
    }
  };

  const renderTooltip = (id, content) => (
    <Tooltip id={id}>
      {content}
    </Tooltip>
  );

  return (
    <div>
      <div className="form-group">
        <label htmlFor={"fabrix-matrix"}>
          FABRIC Matrix
            <OverlayTrigger
              placement="right"
              delay={{ show: 100, hide: 300 }}
              overlay={renderTooltip("fabrix-matrix", fabricMatrixTooltip)}
            >
              <HelpCircle className="mx-2 text-secondary" size={16} />
            </OverlayTrigger>
        </label>
        <input
          className="form-control"
          value={fabricMatrix}
          onChange={onMatrixUpdate}
          disabled={!canUpdate}
        />
      </div>
      <Funding
        fundings={projectFunding}
        canUpdate={canUpdate}
        onFundingUpdate={onFundingUpdate}
      />
      <CommunityTags
        communities={communities}
        canUpdate={canUpdate}
        onCommunityUpdate={onCommunityUpdate}
      />
      <ProjectTopics
        name={"topics"}
        label={"Project Topics"}
        tags={topics}
        disabled={!canUpdate}
        onTagChange={onTagChange}
      />
      {
        canUpdate &&
        <button
          className="btn btn-md btn-primary mt-3"
          onClick={onUpdateProject}
        >
          Save
        </button>
      }
      <div className="table-responsive mt-3 border-top">
        <h5 className="mt-2">Other Information</h5>
        {
          project && project.expired &&
          <table className="table table-striped table-bordered mt-3">
            <tbody>
              <tr>
                <td>Project ID</td>
                <td>
                  <span className="me-2">{ project.uuid }</span>
                  <CopyButton
                    id={project.uuid}
                    text=""
                    showCopiedValue={true}
                    btnStyle={"btn btn-sm btn-outline-primary"}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  Project Permissions <a
                  href={`${portalData.learnArticles.guideToProjectPermissions}#project-permissions`}
                  target="_blank" rel="noreferrer" className="ms-1">
                    <HelpCircle className="mx-2" size={16} />
                  </a>
                </td>
                <td>
                  { projectTags.length > 0 ? renderTags(projectTags) : "No permissions assigned" }
                </td>
              </tr>
              <tr>
                <td>Expiration Date</td>
                <td>
                  {
                    isFO ?
                    <div className="d-flex justify-content-between align-items-center">
                      <CalendarDateTime
                        id="projectExpirationCalendar"
                        name="projectExpirationCalendar"
                        offset={-1}
                        onTimeChange={handleExpirationTimeChange}
                        time={new Date(utcToLocalTimeParser(project.expired).replace(/-/g, "/"))}
                      />
                      <button
                        className="btn btn-sm btn-outline-primary"
                        onClick={handleSetExpiration}
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
                <td>Project Lead Name</td>
                <td>{ project.lead_name }</td>
              </tr>
              <tr>
                <td>Project Lead Email</td>
                <td>{ project.lead_email }</td>
              </tr>
              <tr>
                <td>Project Lead ID</td>
                <td>{ project.lead_id }</td>
              </tr>
              {
                canUpdate &&
                <tr>
                  <td>Danger Zone</td>
                  <td>
                    <DeleteModal
                      name={"Retire Project"}
                      text={"Are you sure you want to retire this project? The project status will be inactive."}
                      id={"retire-project"}
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
};

export default ProjectBasicInfoTable;
