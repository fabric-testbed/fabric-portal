import React, { Component } from "react";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeople } from "../../services/peopleService";
import Dropfile from "../common/Dropfile";
import Tabs from "../common/Tabs";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
    searchCompleted: false,
    membersFailedToFind: [],
  };

  handleInputChange = (input) => {
    this.setState({ searchInput: input, warningMessage: "" });
  }

  handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeople(value);
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
     this.handleSearch(query);
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

  handleSearchMembers = async (members) => {
    console.log("handle search members...")
    console.log(members)
    this.setState({ showSpinner: true, spinnerText: "Uploading..." });
    const uploadMembersToAdd = [];
    const membersFailedToFind = [];
    for (const memberStr of members) {
      const email = memberStr.split(",")[1];
      try {
        const { data: res } = await getPeople(email);
        const memberToAdd = res.results[0];
        uploadMembersToAdd.push(memberToAdd);
      }
      catch(err) {
        membersFailedToFind.push(memberStr);
        console.log(err)
      }
    }

    this.setState({
      membersFailedToFind,
      searchCompleted: true
    });

    console.log(uploadMembersToAdd);
    this.props.onBatchMembersAdd(uploadMembersToAdd);
  }

  handleFileDrop = (membersStr) => {
    try {
      const members = membersStr.split(/\r?\n/);
      this.handleSearchMembers(members);
    } catch (err) {
      toast.error("Failed to gather members' data from the CSV file. Please check if your file meets the format requirements.")
    }
  }

  render() {
    const { searchInput, searchResults, warningMessage, searchCompleted } = this.state;
    const { canUpdate, personnelType, users } = this.props;

    return (
      <div>
        <h4>{personnelType}</h4>
        {
          canUpdate && personnelType === "Project Owners" && <div className="d-flex flex-column my-4">
          <div className="d-flex flex-row">
            <input
              className="form-control search-owner-input"
              value={searchInput}
              placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
              onChange={(e) => this.handleInputChange(e.currentTarget.value)}
              onKeyDown={this.raiseInputKeyDown}
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
          canUpdate && personnelType === "Project Members" &&
          <Tabs activeTab={"Update"}>
            <div label="Update" className="pb-2">
            <div className="d-flex flex-row">
              <input
                className="form-control search-owner-input"
                value={searchInput}
                placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
                onChange={(e) => this.handleInputChange(e.currentTarget.value)}
                onKeyDown={this.raiseInputKeyDown}
              />
              <button
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
            <div label="Batch Update" className="pb-2">
              {
                !searchCompleted &&
                <div className="w-100 bg-light border">
                  <Dropfile
                    onFileDrop={this.handleFileDrop}
                    accept={{'text/csv': [".csv"]}}
                    acceptFormat={"csv"}
                    textStr={"Click to select or drag & drop the CSV file here."}
                  />
                </div>
              }
              {
                searchCompleted &&
                <div className="w-100 bg-success border">
                  Project members uploaded successfully! 
                </div>
              }
            </div>
        </Tabs>
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