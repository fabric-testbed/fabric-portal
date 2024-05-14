import React from "react";
import Joi from "joi-browser";
import withRouter from "../common/withRouter.jsx";
import Form from "../common/Form/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { getPeople } from "../../services/peopleService";
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
    activeTabIndex: 0,
    searchInput: "",
    searchResults: [],
    ownersToAdd: [],
    membersToAdd: [],
    warningMessage: ""
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    is_public: Joi.string().required().label("Public")
  };

  handleCreateProject = async () => {
    const { membersToAdd, ownersToAdd, data } = this.state;
    try {
      let ownerIDs = ownersToAdd.map((user) => user.uuid);
      let memberIDs = membersToAdd.map((user) => user.uuid);
      // redirect users directly to the projects page
      this.props.navigate("/experiments#projects");
      toast.info("Creation request is in process. You'll receive a message when the project is successfully created.");
      // while the async call is processing under the hood
      const  { data: res } = await createProject(data, ownerIDs, memberIDs);
      const newProject = res.results[0];
      // toast message to users when the api call is successfully done.
      toast.success(<ToastMessageWithLink newProject={newProject} />, {autoClose: 10000,});
    }
    catch (err) {
      toast.error("Failed to create project.");
      this.props.navigate("/experiments#projects");
    }
  };

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

  handleInputChange = (input) => {
    this.setState({ searchInput: input, warningMessage: "" });
  }

  checkUserExist = (user, existingUsers) => {
    for (const u of existingUsers) {
      if (user.uuid === u.uuid) {
        return true;
      }
    }
    return false;
  }

  handleAddUser = (newUser) => {
    const { activeTabIndex, ownersToAdd, membersToAdd }= this.state;
    const personnelType = activeTabIndex === 0 ? "Project Owners" : "Project Members";
    const users = activeTabIndex === 0 ? ownersToAdd : membersToAdd;
    if (this.checkUserExist(newUser, users)) {
      // if the user exists, toast a message
      toast.warning(`${newUser.name} already exists in ${personnelType}.`)
    } else {
      // get a shallow copy
      const usersToAdd = [...users];
      usersToAdd.push(newUser);
      if (activeTabIndex === 0) {
        this.setState({ ownersToAdd: usersToAdd });
      } else {
        this.setState({ membersToAdd: usersToAdd });
      }
    }

    this.setState({ searchInput: "", searchResults: [], warningMessage: "" });
  };

  handleDeleteUser = (userToDelete) => {
    const newUsers = [];
    if (this.state.activeTabIndex === 0) {
      for (const user of this.state.ownersToAdd) {
        if (user.name !== userToDelete) {
          newUsers.push(user);
        }
      }
      this.setState({ ownersToAdd: newUsers });
    } else {
      for (const user of this.state.membersToAdd) {
        if (user.name !== userToDelete) {
          newUsers.push(user);
        }
      }
      this.setState({ membersToAdd: newUsers });
    }
  }

  handleToggleTab = (index) => {
    this.setState({ 
      activeTabIndex: index,
      searchInput: "",
      searchResults: [],
      warningMessage: "",
    });
  };

  render() {
    const { publicOptions, activeTabIndex, searchInput, searchResults, warningMessage, 
      ownersToAdd, membersToAdd } = this.state;
    let personnelType = activeTabIndex === 0 ? "Project Owners" : "Project Members";
    let usersToAdd = activeTabIndex === 0 ? ownersToAdd : membersToAdd;
    
    return (
      <div>
        <h1>New Project</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("facility", "Facility", true, portalData.defaultFacility, portalData.facilityOptions)}
          {this.renderSelect("is_public", "Public", true, "Yes", publicOptions, portalData.helperText.publicProjectDescription)}
        </form>
        <div className="mt-4 border">
          <h3>
            Project Membership
          </h3>
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
        <div className="d-flex flex-column my-2">
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
          className="btn btn-primary"
          onClick={this.handleCreateProject}
        >
          Create Project
        </button>
        <div className="alert alert-primary mt-4" role="alert">
          <p>
            There are more features on the project detail page after project creation. 
            Please remember to customize your project after creation is completed. The 
            full features include:
          </p>
          <ul>
            <li>Set privacy preferences.</li>
            <li>Batch upload project members.</li>
            <li>Create and manage project slices.</li>
            <li>Request permissions and storage.</li>
          </ul>
        </div>
      </div>
    );
  }
}

export default withRouter(NewProjectForm);
