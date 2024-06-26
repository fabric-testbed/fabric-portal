import React, { Component } from "react";
import Tabs from "../../common/Tabs";
import ProjectPersonnel from "./ProjectPersonnel";
import ProjectTokenHolders from "./ProjectTokenHolders.jsx";

class ProjectMemberships extends Component {
  state = {
    activeTab: "Project Owners"
  }
  
  render() {
    const { activeTab } = this.state;
    const { canUpdate, owners, members, token_holders, urlSuffix, isTokenHolder, isFO, 
    projectExpired, onUpdateTokenHolders, onUpdateUsers } = this.props;

    return (
      <Tabs activeTab={activeTab}>
          <div label="Project Owners" className="px-2 pb-4">
            <ProjectPersonnel
              personnelType={"Project Owners"}
              canUpdate={canUpdate}
              users={owners}
              onUpdateUsers={onUpdateUsers}
            />
          </div>
          <div label="Project Members" className="px-2 pb-4">
            <ProjectPersonnel
              personnelType={"Project Members"}
              canUpdate={canUpdate}
              users={members}
              onUpdateUsers={onUpdateUsers}
            />
          </div>
          <div label="Long-lived Token Holders" className="px-2 pb-4">
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
    )
  }
}

export default ProjectMemberships;