import React, { Component } from "react";
import AddPersonnel from "./AddPersonnel";
import ProjectUserTable from "./ProjectUserTable";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
    searchCompleted: false,
    uploadMembersToAdd: [],
    membersFailedToFind: [],
    checkedUsers: []
  };

  handleCheckUser = (user) => {
    console.log("handle check user")
    console.log(user)
    const users = [...this.state.checkedUsers];
    users.push(user);
    this.setState({ checkedUsers: users });
  }

  render() {
    const { canUpdate, personnelType, users } = this.props;
    const { checkedUsers } = this.state;

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
                canUpdate={canUpdate}
                onCheckUser={this.handleCheckUser}
              />
              <button
                onClick={() => this.props.onDeleteUsers(checkedUsers)}
                className="btn btn-sm btn-outline-danger"
                disabled={checkedUsers.length === 0}
              >
                Remove from {personnelType}
              </button>
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