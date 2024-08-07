import React, { Component } from "react";
import AddPersonnel from "./AddPersonnel";
import ProjectUserTable from "./ProjectUserTable";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    warningMessage: "",
  };

  render() {
    const { canUpdate, personnelType, users, isFO } = this.props;

    return (
      <div className="px-3 pb-4">
        {
          canUpdate &&
          <AddPersonnel
            personnelType={personnelType}
            onUpdateUsers={this.props.onUpdateUsers}
            users={users}
          />
        }
        {
          users.length > 0 &&
          <div className="card mt-3">
            <div className="card-header" id="headingTwo">
              <h6 className="mb-0">
                {canUpdate ? `Manage ${personnelType}` : `View ${personnelType}`}
              </h6>
            </div>
            <div className="card-body">
              <ProjectUserTable
                users={users}
                personnelType={personnelType}
                canUpdate={canUpdate}
                isFO={isFO}
                onUpdateUsers={this.props.onUpdateUsers}
                inputText={`Filter ${personnelType}...`}
                operation="remove"
              />
            </div>
          </div>
        }
        {
          users.length === 0 && !canUpdate && 
          <div className="alert alert-primary" role="alert">
            {`This project has no ${personnelType}.`}
          </div>
        }
      </div>
    );
  }
}

export default ProjectPersonnel;