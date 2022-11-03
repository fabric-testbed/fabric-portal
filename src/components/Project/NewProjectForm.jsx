import React from "react";
import Joi from "joi-browser";
import ProjectUserTable from "./ProjectUserTable";
import Form from "../common/Form/Form";
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
      is_public: "Yes"
    },
    publicOptions: ["Yes", "No"],
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
    is_public: Joi.string().required().label("Public")
  };

  doSubmit = async () => {
    const { addedMembers, addedOwners, data } = this.state;
    try {
      let ownerIDs = addedOwners.map((user) => user.uuid);
      let memberIDs = addedMembers.map((user) => user.uuid);
      // redirect users directly to the projects page
      this.props.history.push("/projects");
      toast.info("Creation request is in process. You'll receive a message when the project is successfully created.");
      // while the async call is processing under the hood
      const  { data: res } = await createProject(data, ownerIDs, memberIDs);
      const newProject = res.results[0];
      // toast message to users when the api call is successfully done.
      toast.success(<ToastMessageWithLink newProject={newProject} />, {autoClose: 10000,});
    }
    catch (err) {
      toast.error("Failed to create project.");
      this.props.history.push("/projects");
    }
  };

  handleSearch = async (value) => {
    const { activeTabIndex } = this.state;

    if (activeTabIndex === 0) {
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
        toast.error("Cannot find the user. Please check your input to search by name or email address.");
        this.setState({ owners: [] });
      }
    } else if (activeTabIndex === 1) {
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
    const { activeTabIndex, addedOwners, addedMembers } = this.state;

    const added = activeTabIndex === 0 ? addedOwners : addedMembers;
    const found = added.filter((a) => a.uuid === user.uuid).length > 0;
    if (!found) {
      added.push(user);
      if (activeTabIndex === 0) {
        // clear search input field/ search results
        this.setState({ addedOwners: added, ownerSearchInput: "", owners: [] });
      } else {
        this.setState({ addedMembers: added, memberSearchInput: "", members: [] });
      }
    }
  };

  handleDelete = (user) => {
    const { activeTabIndex, addedOwners, addedMembers } = this.state;
    // only delete a added user from state, no interaction with api.
    if (activeTabIndex === 0) {
      let added = addedOwners;
      added = added.filter((u) => u.uuid !== user.uuid);
      this.setState({ addedOwners: added });
    } else if (activeTabIndex === 1) {
      let added = addedMembers;
      added = added.filter((u) => u.uuid !== user.uuid);
      this.setState({ addedMembers: added });
    }
  };

  handleToggleTab = (index) => {
    this.setState({ activeTabIndex: index });
  };

  render() {
    const that = this;
    const { publicOptions, activeTabIndex, ownerSearchInput, memberSearchInput,
      addedOwners, addedMembers, owners, members } = this.state;

    return (
      <div>
        <h1>New Project</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("facility", "Facility", true, portalData.defaultFacility, portalData.facilityOptions)}
          {this.renderSelect("is_public", "Public", true, "", publicOptions)}
          {this.renderButton("Create")}
        </form>
        <div className="mt-4">
          <ul className="nav nav-tabs mb-4">
            <li className="nav-item" onClick={() => this.handleToggleTab(0)}>
              <span
                className={`nav-link ${
                  activeTabIndex === 0 ? "active" : ""
                }`}
              >
                Add Project Owners
              </span>
            </li>
            <li className="nav-item" onClick={() => this.handleToggleTab(1)}>
              <span
                className={`nav-link ${
                  activeTabIndex === 1 ? "active" : ""
                }`}
              >
                Add Project Members
              </span>
            </li>
          </ul>
        </div>
        <div
          className={`${
            activeTabIndex !== 0 ? "d-none" : "d-flex flex-row"
          }`}
        >
          <div className="w-75">
            <div className="toolbar">
              <input
                className="form-control search-owner-input mb-4"
                value={this.stateownerSearchInput}
                placeholder="Search by name/email (at least 4 letters) or UUID to add project owners..."
                onChange={(e) => this.handleInputChange(e.currentTarget.value, "po")}
              />
              <button
                className="btn btn-primary"
                onClick={() => this.handleSearch(ownerSearchInput)}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
            <ProjectUserTable
              users={addedOwners}
              onDelete={this.handleDelete}
              canUpdate={true}
            />
          </div>
          <div className="search-result w-25 border ml-2 p-2">
            <ul className="list-group text-center m-2">
              <li className="list-group-item">Search Result:</li>
              {owners.map((user, index) => {
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
            activeTabIndex !== 1 ? "d-none" : "d-flex flex-row"
          }`}
        >
          <div className="w-75">
            <div className="toolbar">
              <input
                className="form-control search-member-input mb-4"
                placeholder="Search by name/email (at least 4 letters) or UUID to add project members..."
                value={memberSearchInput}
                onChange={(e) => this.handleInputChange(e.currentTarget.value, "pm")}
              />
              <button
                className="btn btn-primary"
                onClick={() => this.handleSearch(memberSearchInput)}
              >
                <i className="fa fa-search"></i>
              </button>
            </div>
            <ProjectUserTable
              users={addedMembers}
              onDelete={this.handleDelete}
              canUpdate={true}
            />
          </div>
          <div className="search-result w-25 border ml-2 p-2">
            <ul className="list-group text-center m-2">
              <li className="list-group-item">Search Result:</li>
              {members.map((user, index) => {
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
                    {
                      user.email && <span>{user.email}</span>
                    }
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
