import React, { Component } from "react";
import AddPersonnel from "./AddPersonnel";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeople } from "../../services/peopleService";

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

  handleInputChange = (input) => {
    this.setState({ searchInput: input, warningMessage: "" });
  }

  handleSearchExistingUsers = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeople(value, false);
        if (res.results.length === 0) {
          this.setState({
            searchResults: [],
            warningMessage: "No users found. Please update your search term and try again." 
          });
        } else {
          this.setState({ searchResults: res.results, warningMessage: "" });
        }
      } else {
        this.setState({
          searchResults: [], 
          warningMessage: "Please enter at least 4 letters to search." 
        });
      }
    } catch (err) {
      toast.error("Cannot find the user. Please check your input to search by name or email address.");
      this.setState({ searchResults: [] });
    }
  };

  raiseInputKeyDown = (e) => {
    const query = e.target.value;
    if ((e.key === "Enter") && query) {
     this.handleSearchExistingUsers(query);
    }
  };

  handleCheckUser = (user) => {
    console.log("handle check user")
    console.log(user)
    const users = [...this.state.checkedUsers];
    users.push(user);
    this.setState({ checkedUsers: users });
  }

  render() {
    const { canUpdate, personnelType, users, checkedUsers } = this.props;

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
          <div className="mt-2">
            <div className="d-flex flex-row justify-content-between mb-2">
              <span>{`${users.length} ${personnelType}`}.</span>
            </div>
            <ProjectUserTable
              users={users}
              canUpdate={canUpdate}
              onCheckUser={this.handleCheckUser}
            />
            <button
              onClick={() => this.props.onDeleteUsers(this.state.checkedUsers)}
              className="btn btn-outline-danger"
              disabled={checkedUsers.length === 0}
            >
              Delete
            </button>
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