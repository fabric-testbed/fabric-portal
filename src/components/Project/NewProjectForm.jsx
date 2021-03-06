import React from "react";
import Joi from "joi-browser";
import ProjectUserTable from "./ProjectUserTable";
import Form from "../common/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import LoadSpinner from "../common/LoadSpinner";
import { toast } from "react-toastify";

import { getPeopleByName } from "../../services/userInformationService";
import { saveProject } from "../../services/projectRegistryService";

import { facilityOptions, defaultFacility } from "../../services/portalData.json";

class NewProjectForm extends Form {
  state = {
    data: {
      name: "",
      uuid: "",
      description: "",
      facility: defaultFacility,
      created_by: {},
      created_time: "",
      project_owners: [],
      project_members: [],
      tags: [],
    },
    errors: {},
    owners: [],
    addedOwners: [],
    members: [],
    addedMembers: [],
    activeTabIndex: 0,
    ownerSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
    memberSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
    ownerSearchInput: "",
    memberSearchInput: "",
    showSpinner: false,
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    created_by: Joi.object(),
    created_time: Joi.string().allow(""),
    project_members: Joi.array(),
    project_owners: Joi.array(),
    tags: Joi.array(),
  };

  doSubmit = async () => {
    // Show loading spinner and when waiting API response
    // to prevent user clicks "submit" many times.
    this.setState({ showSpinner: true });
    try {
      let ownerIDs = this.state.addedOwners.map((user) => user.uuid);
      let memberIDs = this.state.addedMembers.map((user) => user.uuid);
      let data = { ...this.state.data };
      data.project_owners.push(ownerIDs);
      data.project_members.push(memberIDs);
      this.setState({ data });
      await saveProject(this.state.data);
      this.props.history.push("/projects");
    }
    catch (ex) {
      console.log("failed to create project: " + ex.response.data);
      toast.error("Failed to create project.");
      this.props.history.push("/projects");
    }
  };

  handleSearch = async (value) => {
    if (this.state.activeTabIndex === 0) {
      this.setState({ ownerSearchInput: value });
      try {
        if (value.length > 3) {
          const { data: owners } = await getPeopleByName(value);
          this.setState({ owners });
        } else {
          this.setState({ owners: [] });
        }
      } catch (err) {
        console.warn(err);
        this.setState({ owners: [] });
      }
    } else if (this.state.activeTabIndex === 1) {
      this.setState({ memberSearchInput: value });
      try {
        if (value.length > 3) {
          const { data: members } = await getPeopleByName(value);
          this.setState({ members });
        } else {
          this.setState({ members: [] });
        }
      } catch (err) {
        console.warn(err);
        this.setState({ members: [] });
      }
    }
  };

  handleAddUser = (user) => {
    const added =
      this.state.activeTabIndex === 0
        ? this.state.addedOwners
        : this.state.addedMembers;
    const found = added.filter((a) => a.uuid === user.uuid).length > 0;
    if (!found) {
      console.log(user);
      added.push(user);
      if (this.state.activeTabIndex === 0) {
        this.setState({ addedOwners: added });
        // clear search input field.
        this.setState({ ownerSearchInput: "" });
      } else {
        this.setState({ addedMembers: added });
        this.setState({ memberSearchInput: "" });
      }
    }
  };

  handleSort = (sortColumn) => {
    if (this.state.activeTabIndex === 0) {
      this.setState({
        ownerSetting: { ...this.state.ownerSetting, sortColumn: sortColumn },
      });
    } else if (this.state.TableactiveIndex === 1) {
      this.setState({
        memberSetting: { ...this.state.memberSetting, sortColumn: sortColumn },
      });
    }
  };

  handleDelete = (user) => {
    // only delete a added user from state, no interaction with api.
    if (this.state.activeTabIndex === 0) {
      let added = this.state.addedOwners;
      added = added.filter((u) => u.eppn !== user.eppn);
      this.setState({ addedOwners: added });
    } else if (this.state.activeTabIndex === 1) {
      let added = this.state.addedMembers;
      added = added.filter((u) => u.eppn !== user.eppn);
      this.setState({ addedMembers: added });
    }
  };

  handleToggleTab = (index) => {
    this.setState({ activeTabIndex: index });
  };

  render() {
    const that = this;
    const { isFacilityOperator } = this.props;
    return (
      <div>
        <h1>New Project</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("facility", "Facility", true, defaultFacility, facilityOptions)}
          {isFacilityOperator && this.renderInputTag("tags", "Tags")}
          {this.renderButton("Create")}
        </form>
        <div className="mt-4">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item" onClick={() => this.handleToggleTab(0)}>
              <span
                className={`nav-link ${
                  this.state.activeTabIndex === 0 ? "active" : ""
                }`}
              >
                Add Project Owners
              </span>
            </li>
            <li className="nav-item" onClick={() => this.handleToggleTab(1)}>
              <span
                className={`nav-link ${
                  this.state.activeTabIndex === 1 ? "active" : ""
                }`}
              >
                Add Project Members
              </span>
            </li>
          </ul>
        </div>
        <div
          className={`${
            this.state.activeTabIndex !== 0 ? "d-none" : "d-flex flex-row"
          }`}
        >
          <div className="w-75">
            <input
              className="form-control search-owner-input mb-4"
              value={this.state.ownerSearchInput}
              placeholder="Search by name or email (at least 4 letters)..."
              onChange={(e) => this.handleSearch(e.currentTarget.value)}
            />
            <ProjectUserTable
              users={this.state.addedOwners}
              sortColumn={this.state.ownerSetting.sortColumn}
              onSort={this.handleSort}
              onDelete={this.handleDelete}
            />
          </div>
          <div className="search-result w-25 border ml-2 p-2">
            <ul className="list-group text-center m-2">
              <li className="list-group-item">Search Result:</li>
              {this.state.owners.map((user, index) => {
                return (
                  <li key={index} className="list-group-item overflow-auto">
                    <span>{user.name}</span>
                    <button
                      className="btn btn-sm btn-primary ml-2"
                      onClick={() => that.handleAddUser(user)}
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs"/>
                    </button>
                    <br></br>
                    <span>{user.email}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <div
          className={`${
            this.state.activeTabIndex !== 1 ? "d-none" : "d-flex flex-row"
          }`}
        >
          <div className="w-75">
            <input
              className="form-control search-member-input mb-4"
              placeholder="Search by name or email (at least 4 letters)..."
              value={this.state.memberSearchInput}
              onChange={(e) => this.handleSearch(e.currentTarget.value)}
            />
            <ProjectUserTable
              users={this.state.addedMembers}
              sortColumn={this.state.memberSetting.sortColumn}
              onSort={this.handleSort}
              onDelete={this.handleDelete}
            />
          </div>
          <div className="search-result w-25 border ml-2 p-2">
            <ul className="list-group text-center m-2">
              <li className="list-group-item">Search Result:</li>
              {this.state.members.map((user, index) => {
                return (
                  <li key={index} className="list-group-item overflow-auto">
                    <span>{user.name}</span>
                    <button
                      className="btn btn-sm btn-primary ml-2"
                      onClick={() => that.handleAddUser(user)}
                    >
                      <FontAwesomeIcon icon={faPlus} size="xs"/>
                    </button>
                    <br></br>
                    <span>{user.email}</span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
        <LoadSpinner text={"Creating Project..."} showSpinner={this.state.showSpinner} />
      </div>
    );
  }
}

export default NewProjectForm;
