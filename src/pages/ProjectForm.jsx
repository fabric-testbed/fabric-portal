import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Form from "../components/common/Form";
import SideNav from "../components/common/SideNav";
import ProjectUserTable from "../components/Project/ProjectUserTable";
import ProjectBasicInfoTable from "../components/Project/ProjectBasicInfoTable";
import NewProjectForm from "../components/Project/NewProjectForm";
import { toast } from "react-toastify";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { getPeopleByName } from "../services/userInformationService";
import { default as portalData } from "../services/portalData.json";
import { getCurrentUser } from "../services/prPeopleService.js";
import { deleteProject } from "../services/projectRegistryService";

import { getProjectById, getProjectTags } from "../services/projectService";

import {
  saveProject,
  deleteUser,
  addUser,
  updateTags,
} from "../services/projectRegistryService";

class projectForm extends Form {
  state = {
    data: {
      name: "",
      uuid: "",
      description: "",
      facility: "",
      created_by: {},
      created_time: "",
      project_owners: [],
      project_members: [],
      tags: [],
    },
    roles: [],
    errors: {},
    activeIndex: 0,
    SideNavItems: [
      { name: "BASIC INFORMATION", active: true },
      { name: "PROJECT OWNERS", active: false },
      { name: "PROJECT MEMBERS", active: false },
    ],
    originalProjectName: "",
    originalTags: [],
    owners: [],
    members: [],
    ownerSearchInput: "",
    memberSearchInput: "",
    tagVocabulary: [],
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

  async populateProject() {
    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") return;

      const { data } = await getProjectById(projectId);
      const project = data.results[0];
      // keep a shallow copy of project name for project form header
      this.state.originalProjectName = project.name;
      // keep a copy of original tags for comparing on submit.
      this.state.originalTags = project.tags;
      this.setState({ data: this.mapToViewModel(project) });
    } catch (ex) {
      toast.error("Failed to load project.");
      if (ex.response && ex.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateProject();

    try {
      const { data } = await getProjectTags();
      const tags = data.results;
      this.setState({ tagVocabulary: tags });
    } catch (ex) {
      toast.error("Failed to get tags.");
      console.log(ex.response.data);
    }

    try {
      const { data } = await getCurrentUser();
      const user = data.results[0];
      this.setState({ roles: user.roles })
    } catch (ex) {
      console.log("Failed to load user information: " + ex.response.data);
      toast.error("User's credential is expired. Please re-login.");
      this.props.history.push("/projects");
    }
  }

  mapToViewModel(project) {
    // obj from server -> different kind of obj we can use in this form.
    // obj from server has more data then we need, even hierachical data.
    return {
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
      created_by: project.project_creators[0],
      created_time: project.created,
      project_owners: project.project_owners,
      project_members: project.project_members,
      tags: project.tags,
    };
  }

  doSubmit = async () => {
    try {
      await saveProject(this.state.data);
      await updateTags(this.state.originalTags, this.state.data);
    }
    catch (ex) {
      console.log("failed to save project: " + ex.response.data);
      toast.error("Failed to save project.");
      this.props.history.push("/projects");
    }

    toast.success("Project updated successfully!");
    this.props.history.push("/projects");
  };

  parseTags = () => {
    // input: array of tag vocabulary
    // output: arrary of base options; and object of {base: second option} mapping
    const originalTags = this.state.tagVocabulary;
    const baseOptions = [];
    const optionsMapping =  {};

    for (const tag of originalTags) {
      const base = tag.substring(0, tag.indexOf('.'));
      if (!baseOptions.includes(base)) {
        baseOptions.push(base);
        optionsMapping[base] = [];
      }
    }

    for (const tag of originalTags) {
      const base = tag.substring(0, tag.indexOf('.'));
      const second = tag.substring(tag.indexOf('.')+1);
      optionsMapping[base].push(second);
    }

    return { baseOptions, optionsMapping };
  }

  handleSideNavChange = (newIndex) => {
    // change active item in side nav.
    // change the display of main content of right side accordingly.
    this.setState({ activeIndex: newIndex });
  };

  handleAddUser = async (user) => {
    // call api to update the project by a user.
    if (this.state.activeIndex === 1) {
      // add user to project owners
      const originalOwners = this.state.data.project_owners;
      const owners = originalOwners;
      owners.push(user);
      this.setState({ data: { ...this.state.data, project_owners: owners } });
      try {
        await addUser("project_owner", this.state.data.uuid, user.uuid);
        toast.success("Project owner successfully added.");
      } catch (ex) {
        console.log("failed to add project owner: " + ex.response.data);
        toast.error("Failed to add project owner.");
        this.setState({ data: { ...this.state.data, project_owners: originalOwners } });
      }
    } else if (this.state.activeIndex === 2) {
      const originalMembers = this.state.data.project_members;
      const members = originalMembers;
      members.push(user);
      this.setState({ data: { ...this.state.data, project_members: members } });
      try {
        await addUser("project_member", this.state.data.uuid, user.uuid);
        toast.success("Project member successfully added.");
      } catch (ex) {
        console.log("failed to add project member: " + ex.response.data);
        toast.error("Failed to add project member.");
        this.setState({ data: { ...this.state.data, project_members: originalMembers } });
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

  handleSearch = async (value) => {
    // owners/ members are search result.
    if (this.state.activeIndex === 1) {
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
        toast.error("Cannot find the user. Please check your input to search by name or email address.");
        this.setState({ owners: [] });
      }
    } else if (this.state.activeIndex === 2) {
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
        toast.error("Cannot find the user. Please check your input to search by name or email address.");
        this.setState({ members: [] });
      }
    }
  };

  handleDeleteProject = async (project) => {
    try {
      // redirect users directly to the projects page
      this.props.history.push("/projects");
      toast.info("Deletion request is in process. You'll receive a message when the project is successfully deleted.")
      // while the async call is processing under the hood
      await deleteProject(project.uuid);
      // toast message to users when the api call is successfully done.
      toast.success("Project deleted successfully.");
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("This project has been deleted.");
      }
      console.log("failed to delete project: " + ex.response.data);
      toast.error("Failed to delete project.");
      this.props.history.push("/projects");
    }
  };

  handleDelete = async (user) => {
    if (this.state.activeIndex === 1) {
      const originalUsers = this.state.data.project_owners;
      // update the state of the component.
      // create a new users array without current selected user.
      const users = originalUsers.filter((u) => {
        return u.uuid !== user.uuid;
      });

      // new projects obj will overwrite old one in state
      this.setState({ data: { ...this.state.data, project_owners: users } });

      try {
        await deleteUser("project_owner", this.state.data.uuid, user.uuid);
        toast.success("Project owner successfully deleted.");
      } catch (ex) {
        toast.error("Failed to delete project owner.");
        console.log("Failed to delete project owner: " + ex.response.data);
        if (ex.response && ex.response.status === 404) {
          console.log("This user has already been deleted");
        }
        this.setState({
          data: { ...this.state.data, project_owners: originalUsers },
        });
      }
    } else if (this.state.activeIndex === 2) {
      // when delete from member, delete from owner automatically.
      // delete owner accordingly in UI (not reload from API)
      const originalMembers = this.state.data.project_members;
      const members = originalMembers.filter((u) => {
        return u.uuid !== user.uuid;
      });
      const originalOwners = this.state.data.project_owners;
      const owners = originalOwners.filter((u) => {
        return u.uuid !== user.uuid;
      });

      this.setState({ data: { ...this.state.data, project_members: members, project_owners: owners } });

      try {
        await deleteUser("project_member", this.state.data.uuid, user.uuid);
        toast.success("Project member successfully deleted.");
      } catch (ex) {
        toast.error("Failed to delete project member.");
        console.log("Failed to delete project member: " + ex.response.data);
        if (ex.response && ex.response.status === 404) {
          console.log("This user has already been deleted");
        }
        this.setState({
          data: { ...this.state.data, project_members: originalMembers, project_owners: originalOwners },
        });
      }
    }
  };

  checkProjectRole = (projectID, role) => {
    let role_str = projectID + "-" + role;
    return this.state.roles.indexOf(role_str) > -1;
  };

  render() {
    const projectId = this.props.match.params.id;
    const that = this;
    const {
      data,
      originalProjectName,
      SideNavItems,
      activeIndex,
      roles,
      ownerSearchInput,
      owners,
      memberSearchInput,
      members
    } = this.state;
    let isFacilityOperator = roles.indexOf("facility-operators") > -1;

    // ***** Conditional Rendering Project Form *****
    // only facility operator or project creator
    // can update project/ delete project/ update owner;
    let canUpdate = isFacilityOperator || 
      data.created_by.uuid === localStorage.getItem("userID");
    // only facility operator or project owner can update member;
    let canUpdateMember = isFacilityOperator || 
      this.checkProjectRole(data.uuid, "po");
    
    const parsedTags = this.parseTags();

    // 1. New project.
    if (projectId === "new") {
      return (
        <div className="container">
          <NewProjectForm
            history={this.props.history}
            isFacilityOperator={isFacilityOperator}
            baseOptions={parsedTags.baseOptions}
            optionsMapping={parsedTags.optionsMapping}
          />
        </div>
      );
    } else {
      // 2. Show detailed project form.
      return (
        <div className="container">
          <div className="d-flex flex-row justify-content-between">
            <h1>Project - {originalProjectName}</h1>
            <Link to="/projects">
              <button
                className="btn btn-sm btn-outline-primary my-3"
              >
                <i className="fa fa-sign-in mr-2"></i>
                Back to Project List
              </button>
            </Link>
          </div>
          <div className="row mt-4">
            <SideNav
              items={SideNavItems}
              handleChange={this.handleSideNavChange}
            />
            <div
              className={`${activeIndex !== 0 ? "d-none" : "col-9"}`}
            >
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("name", "Name", canUpdate)}
                {this.renderTextarea("description", "Description", canUpdate)}
                {this.renderSelect("facility", "Facility", canUpdate, data.facility, portalData.facilityOptions)}
                {isFacilityOperator && this.renderProjectTags("tags", "Tags", parsedTags.baseOptions, parsedTags.optionsMapping)}
                {canUpdate && this.renderButton("Save")}
              </form>
              <ProjectBasicInfoTable
                data={data}
                canUpdate={canUpdate}
                onDeleteProject={this.handleDeleteProject}
              />
            </div>
            <div
              className={`${
                activeIndex !== 1
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-75">
                { 
                  canUpdate
                  &&
                  <div className="toolbar">
                    <input
                      className="form-control search-owner-input mb-4"
                      value={ownerSearchInput}
                      placeholder="Search by name or email (at least 4 letters) to add more project owners..."
                      onChange={(e) => this.handleInputChange(e.currentTarget.value, "po")}
                    />
                    <button
                      className="btn btn-primary"
                      onClick={() => this.handleSearch(ownerSearchInput)}
                    >
                      <i className="fa fa-search"></i>
                    </button>
                  </div>
                }
                <ProjectUserTable
                  users={data.project_owners}
                  onDelete={this.handleDelete}
                  canUpdate={canUpdate}
                />
              </div>
              { 
                canUpdate
                &&
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
              }
            </div>
            <div
              className={`${
                activeIndex !== 2
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-75">
                { 
                  canUpdateMember
                  &&
                  <div className="toolbar">
                    <input
                      className="form-control search-member-input mb-4"
                      placeholder="Search by name or email (at least 4 letters) to add more project members..."
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
                }
                <ProjectUserTable
                  users={data.project_members}
                  onDelete={this.handleDelete}
                  canUpdate={canUpdateMember}
                />
              </div>
              {
                canUpdateMember
                &&
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
                        <span>{user.email}</span>
                      </li>
                      );
                    })}
                  </ul>
                </div>
              }
            </div>
          </div>
        </div>
      );
    }
  }
}

export default projectForm;