import React, { Component } from "react";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeopleByName } from "../../services/peopleService";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
  };

  handleInputChange = (input) => {
    this.setState({ searchInput: input, warningMessage: "" });
  }

  handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeopleByName(value);
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

  handleDeleteUser = (user) => {
    const { personnelType } = this.props;
    this.props.onSinglePersonnelUpdate(personnelType, user, "remove");
  };

  handleAddUser = (user) => {
    const { personnelType } = this.props;
    this.props.onSinglePersonnelUpdate(personnelType, user, "add");
    this.setState({ searchInput: "", searchResults: [] });
  };

  render() {
    const { searchInput, searchResults, warningMessage } = this.state;
    const { canUpdate, personnelType, users } = this.props;

    return (
      <div>
        <h4>{personnelType}</h4>
        { 
          canUpdate
          &&
          <div className="d-flex flex-column my-4">
            <div className="d-flex flex-row">
              <input
                className="form-control search-owner-input"
                value={searchInput}
                placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
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
              warningMessage !== "" && 
              <div className="alert alert-warning" role="alert">
                {warningMessage}
              </div>
            }
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
                        {
                          user.email ? <div className="mt-1">{`${user.name} (${user.email})`}</div> :
                          <div className="mt-1">{user.name}</div>
                        }
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
        {
          users.length > 0 &&
          <div>
            <div className="d-flex flex-row-reverse mb-2">
              {`${users.length} ${personnelType}`}.
            </div>
            <ProjectUserTable
              users={users}
              onDelete={this.handleDeleteUser}
              canUpdate={canUpdate}
            />
          </div>
        }
        {
          users.length === 0 && !canUpdate && 
          <div className="alert alert-primary" role="alert">
            {`This project has no ${personnelType}.`}
          </div>
        }
        {
          canUpdate &&
          <button className="btn btn-primary mt-3" onClick={this.props.onPersonnelUpdate}>
            Save
          </button>
        }
      </div>
    );
  }
}

export default ProjectPersonnel;