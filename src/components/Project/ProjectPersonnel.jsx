import React, { Component } from "react";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeopleByName } from "../../services/peopleService";
import { updateProjectPersonnel } from "../../services/projectService";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    updatedUsers: [],
  }

  handleInputChange = (input) => {
    this.setState({ searchInput: input });
  }

  handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeopleByName(value);
        this.setState({ searchResults: res.results });
      } else {
        this.setState({ searchResults: [] });
      }
    } catch (err) {
      console.warn(err);
      toast.error("Cannot find the user. Please check your input to search by name or email address.");
      this.setState({ searchResults: [] });
    }
  };

  handleDeleteUser = (user) => {
    if (this.state.updatedUsers.length > 0) {
      this.setState({ updatedUsers: this.state.updatedUsers.filter(u => u.uuid !== user.uuid) });
    } else {
      this.setState({ updatedUsers: this.props.users.filter(u => u.uuid !== user.uuid) });
    }
  };

  handleAddUser = (user) => {
    if (this.state.updatedUsers.length > 0) {
      this.setState({ updatedUsers: [...this.state.updatedUsers, user], searchResults: [] });
    } else {
      this.setState({ updatedUsers: [...this.props.users, user], searchResults: [] });
    }
  };

  getIDs = (users) => {
    return users.map(user => user.uuid);
  }

  handlePersonnelUpdate = async () =>{
    this.setState({ showSpinner: true });

    const { personnelType, project } = this.props;
    const projectId = project.uuid;
    let ownerIDs, memberIDs;

    if (personnelType === "Project Owner") {
      ownerIDs = this.getIDs(this.state.updatedUsers);
      // members remain the same
      memberIDs = this.getIDs(project.project_members);
    } else {
      // owners remain the same
      ownerIDs = this.getIDs(project.project_owners);
      memberIDs = this.getIDs(this.state.updatedUsers);
    }

    try{
      // pass the arr of updated po/pm and the original pm/po
      updateProjectPersonnel(projectId, ownerIDs, memberIDs).then(() => {
        toast.success(`${personnelType} updated successfully.`)
        // TODO
      });
    } catch(err) {
      console.log(err);
      toast("Failed to update project personnel")
    }
  }

  render() {
    const { searchInput, searchResults, updatedUsers } = this.state;
    const { canUpdate, personnelType, users } = this.props;

    let persons = updatedUsers.length > 0 ? updatedUsers : users;

    return (
      <div>
         { 
            canUpdate
            &&
            <div className="d-flex flex-column">
              <button className="btn btn-primary mb-4" onClick={this.handlePersonnelUpdate}>
                {`Update ${personnelType}`}
              </button>
              <div className="d-flex flex-row">
                <input
                  className="form-control search-owner-input"
                  value={searchInput}
                  placeholder={`Search by name or email (at least 4 letters) to add more ${personnelType}...`}
                  onChange={(e) => this.handleInputChange(e.currentTarget.value)}
                />
                <button
                  className="btn btn-primary"
                  onClick={() => this.handleSearch(searchInput)}
                >
                  <i className="fa fa-search"></i>
                </button>
              </div>
              {
                searchResults.length > 0 &&
                  <ul className="list-group">
                  {
                    searchResults.map((user, index) => {
                      return (
                        <li
                          key={`search-user-result-${index}`}
                          className="list-group-item d-flex flex-row justify-content-between"
                        >
                          <div>{`${user.name} (${user.email})`}</div>
                          <button
                            className="btn btn-sm btn-primary ml-2"
                            onClick={() => this.handleAddUser(user)}
                          >
                            Add
                          </button>
                        </li>
                      );
                    })
                  }
                </ul>
              }
            </div>
          }
        <h4 className="mt-3 mb-2">{personnelType}</h4>
        <ProjectUserTable
          users={persons}
          onDelete={this.handleDeleteUser}
          canUpdate={canUpdate}
        />
      </div>
    );
  }
}

export default ProjectPersonnel;