import React, { useState } from "react";
import Tabs from "../../common/Tabs";
import ProjectPersonnel from "./ProjectPersonnel";
import ProjectTokenHolders from "./ProjectTokenHolders.jsx";

const ProjectMemberships = ({ canUpdate, owners, members, token_holders, urlSuffix, isTokenHolder, isFO,
  projectExpired, onUpdateTokenHolders, onUpdateUsers }) => {
  const [activeTab] = useState("Project Owners");

  return (
    <Tabs activeTab={activeTab}>
        <div label="Project Owners">
          <ProjectPersonnel
            personnelType={"Project Owners"}
            canUpdate={canUpdate}
            users={owners}
            onUpdateUsers={onUpdateUsers}
          />
        </div>
        <div label="Project Members">
          <ProjectPersonnel
            personnelType={"Project Members"}
            canUpdate={canUpdate}
            users={members}
            onUpdateUsers={onUpdateUsers}
          />
        </div>
        <div label="Long-lived Token Holders">
          <ProjectTokenHolders
            personnelType={"Token Holders"}
            token_holders={token_holders}
            project_members={members}
            urlSuffix={urlSuffix}
            isTokenHolder={isTokenHolder}
            isFO={isFO}
            projectExpired={projectExpired}
            onUpdateTokenHolders={onUpdateTokenHolders}
          />
        </div>
    </Tabs>
  );
};

export default ProjectMemberships;
