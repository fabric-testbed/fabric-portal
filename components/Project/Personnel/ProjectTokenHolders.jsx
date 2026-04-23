import React from "react";
import ProjectUserTable from "./ProjectUserTable";
import { default as portalData } from "../../../services/portalData.json";
import { LogIn } from "lucide-react";

const ProjectTokenHolders = ({ token_holders, urlSuffix, isTokenHolder,
  isFO, personnelType, project_members, projectExpired, onUpdateTokenHolders }) => {

  return (
    <div className="px-3 pb-4">
      <div className="alert alert-primary mb-2" role="alert">
        {"Users running long-lived experiments supported by unattended automated tools can now request non-renewable long-lived API Tokens (lifetime up to 9 weeks)."}
        {"For more information, please read this guide article: "}
        <a
          href={portalData.learnArticles.guideToLongLivedTokens}
          target="_blank"
          rel="noreferrer"
        >
          Using long-lived API Tokens
        </a>.
      </div>
      {
        isFO && !projectExpired &&
        <div className="card mt-3">
          <div className="card-header" id="headingTwo">
            <h6 className="mb-0">
              Add Token Holders
            </h6>
          </div>
          <div className="card-body">
            <ProjectUserTable
              users={project_members.filter(user => !token_holders.find(holder => holder.uuid === user.uuid))}
              personnelType={personnelType}
              canUpdate={isFO}
              onUpdateUsers={onUpdateTokenHolders}
              inputText={"Filter Project Members..."}
              operation="add"
            />
          </div>
        </div>
      }
        <div className="card mt-3">
          <div className="card-header" id="headingTwo">
            <h6 className="mb-0">
              {isFO ? `Manage Token Holders` : `View Token Holders`}
            </h6>
          </div>
          <div className="card-body">
          {
            token_holders && token_holders.length > 0 ?
            <ProjectUserTable
              users={token_holders}
              personnelType={personnelType}
              canUpdate={isFO && !projectExpired}
              onUpdateUsers={onUpdateTokenHolders}
              inputText={`Filter ${personnelType}...`}
              operation="remove"
            /> :
            <div className="alert alert-primary" role="alert">
              {`This project has no long-lived ${personnelType}.`}
            </div>
          }
          </div>
        </div>
      {
        !isTokenHolder && !isFO && !projectExpired && <button
          className="btn btn-sm btn-outline-success me-2 my-3"
          onClick={() => window.open(
            `${portalData.jiraLinks.longlivedTokenRequest}?${urlSuffix}`,
            "_blank")
          }
        >
          <LogIn className="me-2" size={16} />
          Request Long-lived Token Access
        </button>
      }
    </div>
  );
};

export default ProjectTokenHolders;
