import React, { Component } from "react";
import AddPersonnel from "./AddPersonnel";
import ProjectUserTable from "./ProjectUserTable";
import { toast } from "react-toastify";
import { getPeople } from "../../services/peopleService";
import Dropfile from "../common/Dropfile";
import Tabs from "../common/Tabs";
import SpinnerWithText from "../common/SpinnerWithText";

class ProjectPersonnel extends Component {
  state = {
    showSpinner: false,
    searchInput: "",
    searchResults: [],
    warningMessage: "",
    searchCompleted: false,
    uploadMembersToAdd: [],
    membersFailedToFind: [],
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
    this.setState({ showSpinner: true, spinnerText: "Uploading..." });
    const uploadMembersToAdd = [];
    const membersFailedToFind = [];
    for (const memberStr of members) {
      const email = memberStr && memberStr.split(",")[0].trim().replace(/\s/g, "");
      try {
        const { data: res } = await getPeople(email, true);
        if (res.results[0]) {
          const memberToAdd = res.results[0];
          uploadMembersToAdd.push(memberToAdd);
        } else {
          membersFailedToFind.push(memberStr);
        }
      }
      catch(err) {
        console.log(err)
      }
    }

    this.setState({
      uploadMembersToAdd,
      membersFailedToFind,
      searchCompleted: true,
      showSpinner: false
    });

    this.props.onBatchMembersUpdate(uploadMembersToAdd);
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
    const { canUpdate, personnelType, users } = this.props;

    return (
      <div>
        <h4>{personnelType}</h4>
        {
          canUpdate && 
          <AddPersonnel
            personnelType={personnelType}
          />
        }
        {
          users.length > 0 &&
          <div className="mt-2">
            <div className="d-flex flex-row justify-content-between mb-2">
              <span>{`${users.length} ${personnelType}`}.</span>
              {
                canUpdate && <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={this.props.onAllMembersDelete}
                >
                  Delete All
                </button>
              }
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
      </div>
    );
  }
}

export default ProjectPersonnel;