import React, { Component } from "react";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeopleByName } from "../../services/peopleService";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
  };

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
    const { searchInput, searchResults } = this.state;
    const { canUpdate, personnelType, users } = this.props;

    return (
      <div>
         { 
            canUpdate
            &&
            <div className="d-flex flex-column">
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
                searchResults.length === 0 && 
                <div className="alert alert-warning" role="alert">
                  No users found. Please update your search term and try again.
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
                          <div className="mt-1">{`${user.name} (${user.email})`}</div>
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
        <div className="d-flex flex-row">
          <h4 className="mt-3 mb-2">{personnelType}</h4>
          {canUpdate && <span className="ml-2 mt-4 mb-3 badge badge-sm badge-light">* Click the Update button at bottom to save changes.</span>}
        </div>
        <ProjectUserTable
          users={users}
          onDelete={this.handleDeleteUser}
          canUpdate={canUpdate}
        />
        {
          canUpdate &&
          <button className="btn btn-primary mt-4 w-100" onClick={this.props.onPersonnelUpdate}>
            {`Update ${personnelType}`}
          </button>
        }
      </div>
    );
  }
}

export default ProjectPersonnel;