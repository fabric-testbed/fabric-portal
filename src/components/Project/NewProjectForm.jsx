import React from "react";
import Joi from "joi-browser";
import ProjectUserTable from "./ProjectUserTable";
import Form from "../common/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { getPeopleByName } from "../../services/peopleService";

import { createProject } from "../../services/projectService";

import { default as portalData } from "../../services/portalData.json";

const ToastMessageWithLink = ({newProject}) => (
  <div className="ml-2">
    <p className="text-white">Project created successfully.</p>
    <Link to={`/projects/${newProject.uuid}`}>
      <button className="btn btn-sm btn-outline-light">
        View New Project
      </button>
    </Link>
  </div>
)

class NewProjectForm extends Form {
  state = {
    data: {
      name: "",
      uuid: "",
      description: "",
      facility: portalData.defaultFacility,
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
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
  };

  doSubmit = async () => {
    try {
      let ownerIDs = this.state.addedOwners.map((user) => user.uuid);
      let memberIDs = this.state.addedMembers.map((user) => user.uuid);
      // redirect users directly to the projects page
      this.props.history.push("/projects");
      toast.info("Creation request is in process. You'll receive a message when the project is successfully created.");
      // while the async call is processing under the hood
      const  { data: res } = await createProject(this.state.data, ownerIDs, memberIDs);
      const newProject = res.results[0];
      // toast message to users when the api call is successfully done.
      toast.success(<ToastMessageWithLink newProject={newProject} />, {autoClose: 10000,});
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
          const { data: res } = await getPeopleByName(value);
          const owners = res.results;
          this.setState({ owners });
        } else {
          this.setState({ owners: [] });
        }
      } catch (err) {
        console.warn(err);
        toast.error("Cannot find the user. Please check your input to search by name or email address.");
        this.setState({ owners: [] });
      }
    } else if (this.state.activeTabIndex === 1) {
      this.setState({ memberSearchInput: value });
      try {
        if (value.length > 3) {
          const { data: res } = await getPeopleByName(value);
          const members = res.results;
          this.setState({ members });
        } else {
          this.setState({ members: [] });
        }
      } catch (err) {
        console.warn(err);
        toast.error("Cannot find the user. Please check your input to search by name or email address.");
        this.setState({ members: [] });
      }
    }
  };

  handleInputChange = (input, type) => {
    if (type === "po") {
      this.setState({ ownerSearchInput: input });
    }
    if (type === "pm") {
      this.setState({ memberSearchInput: input });
    }
  }

  handleAddUser = (user) => {
    const added =
      this.state.activeTabIndex === 0
        ? this.state.addedOwners
        : this.state.addedMembers;
    const found = added.filter((a) => a.uuid === user.uuid).length > 0;
    if (!found) {
      added.push(user);
      if (this.state.activeTabIndex === 0) {
        // clear search input field/ search results
        this.setState({ addedOwners: added, ownerSearchInput: "", owners: [] });
      } else {
        this.setState({ addedMembers: added, memberSearchInput: "", members: [] });
      }
    }
  };

  handleDelete = (user) => {
    // only delete a added user from state, no interaction with api.
    if (this.state.activeTabIndex === 0) {
      let added = this.state.addedOwners;
      added = added.filter((u) => u.uuid !== user.uuid);
      this.setState({ addedOwners: added });
    } else if (this.state.activeTabIndex === 1) {
      let added = this.state.addedMembers;
      added = added.filter((u) => u.uuid !== user.uuid);
      this.setState({ addedMembers: added });
    }
  };

  handleToggleTab = (index) => {
    this.setState({ activeTabIndex: index });
  };

  render() {
    const that = this;

    return (
      <div>
        <h1>New Project</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("facility", "Facility", true, portalData.defaultFacility, portalData.facilityOptions)}
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
            <div className="toolbar">
              <input
                className="form-control search-owner-input mb-4"
                value={this.stateownerSearchInput}
                placeholder="Search by name or email (at least 4 letters) to add more project owners..."
                onChange={(e) => this.handleInputChange(e.currentTarget.value, "po")}
              />
              <button
                className="btn btn-primary"
                onClick={() => this.handleSearch(this.state.ownerSearchInput)}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
            <ProjectUserTable
              users={this.state.addedOwners}
              onDelete={this.handleDelete}
              canUpdate={true}
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
            <div className="toolbar">
              <input
                className="form-control search-member-input mb-4"
                placeholder="Search by name or email (at least 4 letters) to add more project members..."
                value={this.state.memberSearchInput}
                onChange={(e) => this.handleInputChange(e.currentTarget.value, "pm")}
              />
              <button
                className="btn btn-primary"
                onClick={() => this.handleSearch(this.state.memberSearchInput)}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
            <ProjectUserTable
              users={this.state.addedMembers}
              onDelete={this.handleDelete}
              canUpdate={true}
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
      </div>
    );
  }
}

export default NewProjectForm;
