import React, { Component } from "react";
import AddPersonnel from "./AddPersonnel";
import ProjectUserTable from "./ProjectUserTable";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    warningMessage: "",
  };

  render() {
    const { canUpdate, personnelType, users } = this.props;

    return (
      <div>
        <h4>{personnelType}</h4>
        {
          canUpdate && 
          <AddPersonnel
            personnelType={personnelType}
            onPersonnelAdd={this.props.onPersonnelAdd}
            users={users}
          />
        }
        {
          users.length > 0 &&
          <div className="card mt-3">
            <div className="card-header" id="headingTwo">
              <h6 className="mb-0">
                Manage {personnelType} 
              </h6>
            </div>
            <div className="card-body">
              <ProjectUserTable
                users={users}
                personnelType={personnelType}
                canUpdate={canUpdate}
                onDeleteUsers={this.props.onDeleteUsers}
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