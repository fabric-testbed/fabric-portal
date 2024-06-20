import React from "react";
import Tabs from "../components/common/Tabs";
import ProjectPersonnel from "./ProjectPersonnel";
import ProjectTokenHolders from "./ProjectTokenHolders.jsx";

class ProjectMemberships {
  state = {
    activeTab: "Project Owners"
  }
  render() {
    const { activeTab } = this.state;
    const { canUpdate, owners, members, token_holders, urlSuffix, isTokenHolder, isFO, 
    projectExpired, onUpdateTokenHolders, onUpdateUsers } = this.props;

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
              users={owners}
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
              projectExpired={this.checkProjectExpiration(projectExpired)}
              onUpdateTokenHolders={onUpdateTokenHolders}
            />
          </div>
      </Tabs>
    )
  }
}

export default ProjectMemberships;