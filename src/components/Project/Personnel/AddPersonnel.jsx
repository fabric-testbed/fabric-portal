import React, { Component } from "react";
import { toast } from "react-toastify";
import { getPeople } from "../../../services/peopleService";
import Dropfile from "../../common/Dropfile";
import Tabs from "../../common/Tabs";
import SpinnerWithText from "../../common/SpinnerWithText";

class AddPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
    searchCompleted: false,
    usersFailedToFind: [],
    usersToAdd: []
  };

  handleDeleteUser = (userToDelete) => {
    const newUsers = [];
    for (const user of this.state.usersToAdd) {
      if (user.name !== userToDelete) {
        newUsers.push(user);
      }
    }
    this.setState({ usersToAdd: newUsers });
  }

  handleInputChange = (input) => {
    this.setState({ searchInput: input, warningMessage: "" });
  }

  handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: res } = await getPeople(value, false);
        if (res.results.length === 0) {
          this.setState({
            searchResults: [],
            warningMessage: "No users found. Please update your search query and try again." 
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

  checkUserExist = (user, existingUsers) => {
    for (const u of existingUsers) {
      if (user.uuid === u.uuid) {
        return true;
      }
    }
    return false;
  }

  handleAddUser = (newUser) => {
    const { personnelType, users } = this.props;
    if (this.checkUserExist(newUser, users)) {
      // if the user exists, toast a message
      toast.warning(`${newUser.name} already exists in ${personnelType}.`)
    } else {
      // get a shallow copy
      const toAdd = [...this.state.usersToAdd];
      toAdd.push(newUser);
      this.setState({                                  
        usersToAdd: toAdd 
      })
    }
    this.setState({ searchInput: "", searchResults: [] });
  };

  handleSearchMembers = async (members) => {
    const { personnelType, users } = this.props;
    this.setState({ showSpinner: true, spinnerText: "Uploading..." });
    const usersToAdd = [];
    const usersFailedToFind = [];
    for (const memberStr of members) {
      const email = memberStr && memberStr.split(",")[0].trim().replace(/\s/g, "");
      try {
        const { data: res } = await getPeople(email, true);
        if (res.results[0]) {
          const memberToAdd = res.results[0];
          if (this.checkUserExist(memberToAdd, users)) {
            // if the user exists, toast a message
            toast.warning(`${memberToAdd.name} already exists in ${personnelType}.`)
          } else {
            usersToAdd.push(memberToAdd);
          }
        } else {
          usersFailedToFind.push(memberStr);
        }
      }
      catch(err) {
        console.log(err)
      }
    }

    this.setState({
      usersToAdd,
      usersFailedToFind,
      searchCompleted: true,
      showSpinner: false
    });
  }

  handleFileDrop = (membersStr) => {
    try {
      const members = membersStr && membersStr.split(/\r?\n/);
      if (members.length <= 300) {
        this.handleSearchMembers(members);
      } else {
        toast.error("Please upload at most 300 users (300 rows for the CSV file) at a time.");
      }
    } catch (err) {
      toast.error("Failed to gather members' data from the CSV file. Please check if your file meets the format requirements.")
    }
  }

  refreshTab = () => {
    window.location.reload();
  }

  getIDs = (users) => {
    return users.map(user => user.uuid);
  }

  render() {
    const { searchInput, searchResults, warningMessage,
      searchCompleted, usersFailedToFind, showSpinner, usersToAdd } = this.state;
    const { personnelType } = this.props;

    return (
      <div className="card mt-3">
        <div className="card-header" data-toggle="collapse" data-target="#collapseOne" aria-controls="collapseOne" id="headingOne">
          <h6 className="mb-0">
            Add {personnelType}
          </h6>
        </div>
        <div id="collapseOne" className="collapse show" aria-labelledby="headingOne" data-parent="#accordion">
          <div className="card-body">
            {
              personnelType === "Project Owners" && <div className="d-flex flex-column my-2">
              <div className="d-flex flex-row">
                <input
                  className="form-control search-owner-input"
                  value={searchInput}
                  placeholder={`Search by name/email (at least 4 letters) or UUID to add ${personnelType}...`}
                  onChange={(e) => this.handleInputChange(e.currentTarget.value)}
                  onKeyDown={this.raiseInputKeyDown}
                />
                <button
                  className="btn btn-outline-primary"
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
                <ul className="list-group mb-2 search-box-list-group">
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
                            className="btn btn-sm btn-outline-primary ml-2"
                            onClick={() => this.handleAddUser(user)}
                          >
                            <i className="fa fa-plus"></i>
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
              personnelType === "Project Members" &&
              <Tabs activeTab={"Search"}>
                <div label="Search">
                <div className="d-flex flex-row mb-2">
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
                    <ul className="list-group search-box-list-group">
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
                              className="btn btn-sm btn-outline-primary ml-2"
                              onClick={() => this.handleAddUser(user)}
                            >
                              <i className="fa fa-plus"></i>
                            </button>
                          </li>
                        );
                      })
                    }
                    </ul>
                  }
                </div>
                <div label="Batch Upload">
                  {
                    !searchCompleted && !showSpinner &&
                    <div className="w-100 bg-light border pt-3 mb-2">
                      <Dropfile
                        onFileDrop={this.handleFileDrop}
                        accept={{'text/csv': [".csv"]}}
                        acceptFormat={"csv"}
                        textStr={"Click to select or drag & drop CSV file (with user email as the first column). [Max: 300 rows]"}
                      />
                    </div>
                  }
                  {
                    showSpinner && !searchCompleted && <SpinnerWithText text={"Uploading users..."} />
                  }
                  {
                    usersFailedToFind.length > 0 &&
                    <div className="alert alert-warning max-height-overflow-scroll">
                      <i className="fa fa-exclamation-triangle mr-2"></i>
                      We couldn't find the users below. Please make sure:  1. email is the first column of the CSV file; 2. name and email information 
                      are correct; 3. users have sucessfully enrolled as active FABRIC users.
                      <ul className="list-group mt-2 ml-4">
                        {
                          usersFailedToFind.map((memberStr, index) => {
                            return (
                              <li
                                key={`failed-search-user-result-${index}`}
                              >
                                { memberStr }
                              </li>
                            );
                          })
                        }
                      </ul>
                    </div>
                  }
                </div>
              </Tabs>
            }
            {
              searchCompleted && !showSpinner &&
              <div className="alert alert-success my-2" role="alert">
                <i className="fa fa-check mr-2"></i>
                Users below are uploaded successfully! Please click the <b>Add</b> button to complete adding to project members.
              </div>
            }
            <ul className="input-tag__tags">
              {
                usersToAdd.length > 0 &&
                usersToAdd.map((user, index) => 
                <li
                  key={`user-to-add-${index}`}
                  className="mr-2 my-2"
                >
                  {user.email ? `${user.name}(${user.email})` : user.name}
                <i
                  className="fa fa-times ml-2"
                  onClick={() => {
                    this.handleDeleteUser(user.name);
                  }}
                ></i>
              </li>)
              }
            </ul>
            <button
              className="btn btn-sm btn-outline-primary mr-3 mt-1"
              onClick={() => this.props.onUpdateUsers(personnelType, this.getIDs(usersToAdd), "add")}
              disabled={ usersToAdd.length === 0}
            >
              Add to {personnelType}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddPersonnel;