import React, { Component } from "react";
import { toast } from "react-toastify";
import { getPeople } from "../../services/peopleService";
import Dropfile from "../common/Dropfile";
import Tabs from "../common/Tabs";
import SpinnerWithText from "../common/SpinnerWithText";

class AddPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
    searchCompleted: false,
    membersFailedToFind: [],
    membersToAdd: []
  };

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

  handleAddUser = (user) => {
    const { personnelType } = this.props;
    const members = this.state.membersToAdd;
    // this.props.onSinglePersonnelUpdate(personnelType, user, "add");
    this.setState({
      memberToAdd: [members, user]
    })
    this.setState({ searchInput: "", searchResults: [] });
  };

  handleSearchMembers = async (members) => {
    this.setState({ showSpinner: true, spinnerText: "Uploading..." });
    const membersToAdd = [];
    const membersFailedToFind = [];
    for (const memberStr of members) {
      const email = memberStr && memberStr.split(",")[0].trim().replace(/\s/g, "");
      try {
        const { data: res } = await getPeople(email, true);
        if (res.results[0]) {
          const memberToAdd = res.results[0];
          membersToAdd.push(memberToAdd);
        } else {
          membersFailedToFind.push(memberStr);
        }
      }
      catch(err) {
        console.log(err)
      }
    }

    this.setState({
      membersToAdd,
      membersFailedToFind,
      searchCompleted: true,
      showSpinner: false
    });

    this.props.onBatchMembersUpdate(membersToAdd);
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

  render() {
    const { searchInput, searchResults, warningMessage,
      searchCompleted, membersFailedToFind, showSpinner, membersToAdd } = this.state;
    const { personnelType } = this.props;

    return (
      <div className="add-project-personnel">
        <button
          className="btn btn-sm btn-primary mr-3 mb-2"
          onClick={this.props.onPersonnelUpdate}
        >
          <i className="fa fa-floppy-o mr-1"></i>
          Add
        </button>
        {
          membersToAdd.length > 0 && membersToAdd.map(member => <span className="badge badge-secondary">member</span>)
        }
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
                        className="btn btn-sm btn-outline-primary ml-2"
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
                          className="btn btn-sm btn-outline-primary ml-2"
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
            <div label="Batch Upload">
              {
                !searchCompleted && !showSpinner &&
                <div className="w-100 bg-light border pt-3 mb-2">
                  <Dropfile
                    onFileDrop={this.handleFileDrop}
                    accept={{'text/csv': [".csv"]}}
                    acceptFormat={"csv"}
                    textStr={"Click to select or drag & drop the CSV file here (with user email as the first column). [Max: 300 rows]"}
                  />
                </div>
              }
              {
                searchCompleted && !showSpinner &&
                <div className="alert alert-success my-2" role="alert">
                  <i className="fa fa-check mr-2"></i>
                  Project members uploaded successfully! Please check the list and <b>SAVE</b> the changes before leaving this page.
                </div>
              }
              {
                showSpinner && !searchCompleted && <SpinnerWithText text={"Uploading users..."} />
              }
              {
                membersFailedToFind.length > 0 &&
                <div className="alert alert-warning">
                  <i className="fa fa-exclamation-triangle mr-2"></i>
                  We couldn't find the users below. Please make sure:  1. email is the first column of the CSV file; 2. name and email information 
                  are correct; 3. users have sucessfully enrolled as active FABRIC users.
                  <ul className="list-group mt-2 ml-4">
                    {
                      membersFailedToFind.map((memberStr, index) => {
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
      </div>
    );
  }
}

export default AddPersonnel;