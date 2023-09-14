import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import withRouter from "../components/common/withRouter.jsx";
import Form from "../components/common/Form/Form";
import InputCheckboxes from "../components/common/InputCheckboxes";
import SideNav from "../components/common/SideNav";
import ProjectPersonnel from "../components/Project/ProjectPersonnel";
import ProjectProfile from "../components/Project/ProjectProfile";
import ProjectBasicInfoTable from "../components/Project/ProjectBasicInfoTable";
import NewProjectForm from "../components/Project/NewProjectForm";
import { toast } from "react-toastify";
import { default as portalData } from "../services/portalData.json";
import { getCurrentUser } from "../services/peopleService.js";
import { updateProjectPersonnel } from "../services/projectService";
import checkGlobalRoles from "../utils/checkGlobalRoles"; 
import SpinnerFullPage from "../components/common/SpinnerFullPage";
import Slices from "../components/Experiment/Slices";

import {
  getProjectById,
  getProjectTags,
  deleteProject,
  updateProject,
  updateTags,
} from "../services/projectService";
import ProjectTokenHolders from "../components/Project/ProjectTokenHolders.jsx";

const ToastMessageWithLink = ({projectId, message}) => (
  <div className="ml-2">
    <p className="text-white">{ message }</p>
    <Link to={`/projects/${projectId}`}>
      <button className="btn btn-sm btn-outline-light">
        View Project
      </button>
    </Link>
  </div>
)

class ProjectForm extends Form {
  state = {
    data: {
      uuid: "",
      name: "",
      description: "",
      facility: "",
      tags: [],
      modified: "",
      created: "",
      creator_name: "",
      creator_id: "",
      creator_email: "",
      is_creator: false,
      is_member: false,
      is_owner: false,
      is_token_holder: false,
      is_public: false,
      is_locked: false,
      allOptions: [
        "show_project_owners",
        "show_project_members",
      ],
      selectedOptions: []
    },
    allOptions: [
      "show_project_owners",
      "show_project_members",
    ],
    publicOptions: ["Yes", "No"],
    optionsDisplayMapping: {
      "show_project_owners": "Project Owners",
      "show_project_members": "Project Members"
    },
    user: {},
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: false,
    },
    errors: {},
    activeIndex: 0,
    SideNavItems: [
      { name: "BASIC INFORMATION", active: true },
      { name: "PROJECT OWNERS", active: false },
      { name: "PROJECT MEMBERS", active: false },
      { name: "LONG-LIVED TOKEN", active: false },
      { name: "SLICES", active: false },
    ],
    originalProjectName: "",
    owners: [],
    members: [],
    token_holders: [],
    tagVocabulary: [],
    showSpinner: false,
    spinner: {
      text: "",
      btnText: "",
      btnPath: ""
    },
    selectedTags: [],
    originalTags: []
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    tags: Joi.array(),
    modified: Joi.string().allow(""),
    created: Joi.string().allow(""),
    creator_name: Joi.string().allow(""),
    creator_id: Joi.string().allow(""),
    creator_email: Joi.string().allow(""),
    is_creator: Joi.boolean(),
    is_member: Joi.boolean(),
    is_owner: Joi.boolean(),
    is_token_holder: Joi.boolean(),
    is_public: Joi.string().required().label("Public"),
    is_locked: Joi.boolean(),
    allOptions: Joi.array(),
    selectedOptions: Joi.array()
  };

  async populateProject() {
    this.setState({
      showSpinner: true,
      spinner: {
      text: "Loading project...",
      btnText: "",
      btnPath: ""
      }
    });

    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") {
        this.setState({
          showSpinner: false,
          spinner: {
            text: "",
            btnText: "",
            btnPath: ""
          }
        });
        return;
      }

      const { data } = await getProjectById(projectId);

      console.log("project data:");
      console.log(data)

      const project = data.results[0];
      // keep a shallow copy of project name for project form header
      this.state.originalProjectName = project.name;

      // check if view as public profile (user is not PC/PO/PM/FO)
      if(project.memberships && !project.memberships.is_creator && 
        !project.memberships.is_member && !project.memberships.is_owner &&
        !this.state.globalRoles.isFacilityOperator) {
          this.setState({ 
            data: project, 
            showSpinner: false,
            spinner: {
              text: "",
              btnText: "",
              btnPath: ""
            }
          });
      } else {
        // user is po/pm/pc or Facility Operator.
        this.setState({ 
          data: this.mapToViewModel(project), 
          owners: project.project_owners, 
          members: project.project_members,
          token_holders: project.token_holders,
          showSpinner: false,
          spinner: {
            text: "",
            btnText: "",
            btnPath: ""
          },
          selectedTags: project.tags,
          originalTags: project.tags
        });
      }
    } catch (err) {
      toast.error("Failed to load project.");
      if (err.response && err.response.status === 404) {
        this.props.navigate("/not-found");
      }
    }
  }

  async componentDidMount() {
     // use url anchor for tab display
     const hash = this.props.location.hash;
     const activeMap = {
       "#info": 0,
       "#owners": 1,
       "#members": 2,
       "#token": 3,
       "#slices": 4,
     }
 
     if (hash) {
       this.setState({ activeIndex: activeMap[hash] });
       this.setState({ SideNavItems: [
         { name: "BASIC INFORMATION", active: hash === "#info" },
         { name: "PROJECT OWNERS", active: hash === "#owners" },
         { name: "PROJECT MEMBERS", active: hash === "#members" },
         { name: "LONG-LIVED TOKEN", active: hash === "#token"},
         { name: "SLICES", active: hash === "#slices" },
       ]})
     }
     
    try {
      const { data: res2 } = await getCurrentUser();
      this.setState({ user: res2.results[0], globalRoles: checkGlobalRoles(res2.results[0]) });
    } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
      this.props.navigate("/experiments#projects");
    }

    try {
      const { data: res1 } = await getProjectTags();
      const tags = res1.results;
      this.setState({ tagVocabulary: tags  });
    } catch (err) {
      toast.error("Failed to get tags.");
    }

    await this.populateProject();
  }

  mapToViewModel(project) {
    // obj from server -> different kind of obj we can use in this form.
    // obj from server has more data then we need, even hierachical data.
    return {
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
      tags: project.tags,
      modified: project.modified,
      created: project.created,
      creator_name: project.project_creators[0].name,
      creator_id: project.project_creators[0].uuid,
      creator_email: project.project_creators[0].email,
      is_creator: project.memberships.is_creator,
      is_member: project.memberships.is_member,
      is_owner: project.memberships.is_owner,
      is_token_holder: project.memberships.is_token_holder,
      is_public: project.is_public ? "Yes" : "No",
      is_locked: project.is_locked,
      allOptions: [
        "show_project_owners",
        "show_project_members",
      ],
      selectedOptions: Object.keys(project.preferences).filter(key => 
        project.preferences[key] && this.state.allOptions.includes(key))
    };
  }

  parsePreferences = () => {
    const preferences = {};

    for (const option of this.state.allOptions) {
      preferences[option] = this.state.data.selectedOptions.includes(option);
    }

    return preferences;
  }

  doSubmit = async () => {
    this.setState({
      showSpinner: true,
      spinner: {
        text: "Updating project...",
        btnText: "",
        btnPath: ""
      }
    });

    const { data: project } = this.state;
    try {
      await updateProject(project, this.parsePreferences());
      this.setState({
        showSpinner: false,
        spinner: {
          text: "",
          btnText: "",
          btnPath: ""
        },
        originalProjectName: project.name
      });
      toast.success("Project updated successfully!");
    }
    catch (err) {
      this.setState({
        showSpinner: false,
        spinner: {
          text: "",
          btnText: "",
          btnPath: ""
        }
      });
      toast.error("Failed to save project.");
    }

    this.props.navigate(`/projects/${project.uuid}`);
  };

  handleTagCheck = (option) => {
    const { selectedTags, tagVocabulary } = this.state;

    if (option === "all") {
      if (selectedTags.length === tagVocabulary.length) {
        this.setState({ selectedTags: [] });
      } else {
        this.setState({ selectedTags: tagVocabulary });
      }
    } else {
      if (selectedTags.includes(option)) {
        this.setState({ selectedTags: selectedTags.filter(o => o !== option) });
      } else {
        this.setState({ selectedTags: [...selectedTags, option] });
      }
    }
  }

  handlePermissionUpdate = async () => {
    const {  data: project , selectedTags } = this.state;
    this.setState({
      showSpinner: true,
      spinner: {
        text: "Updating project permissions...",
        btnText: "",
        btnPath: ""
      }
    });
    try {
      await updateTags( project.uuid, selectedTags);
      this.setState({ originalTags: selectedTags });
      toast.success(`Permissions updated successfully.`);
    } catch (err) {
      toast.error("Failed to save project permissions.");
    }
    this.setState({
      showSpinner: false,
      spinner: {
        text: "",
        btnText: "",
        btnPath: ""
      }
    });
  }

  handleSideNavChange = (newIndex) => {
    // change active item in side nav.
    // change the display of main content of right side accordingly.
    const indexToHash = {
      0: "#info",
      1: "#owners",
      2: "#members",
      3: "#token",
      4: "#slices",
    }
    this.setState({ activeIndex: newIndex });
    this.props.navigate(`/projects/${this.props.match.params.id}${indexToHash[newIndex]}`);
  };

  handleDeleteProject = async (project) => {
    try {
      // redirect users directly to the projects page
      this.props.navigate("/experiments#projects");
      toast.info("Deletion request is in process. You'll receive a message when the project is successfully deleted.")
      // while the async call is processing under the hood
      await deleteProject(project.uuid);
      // toast message to users when the api call is successfully done.
      toast.success("Project deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete project.");
      this.props.navigate("/experiments#projects");
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

  handleSinglePersonnelUpdate = (personnelType, user, operation) => {
    // personnelType: "Project Owner" / "Project Member"
    // operation: "add" / "remove"
    if (personnelType === "Project Owners") {
      if (operation === "add") {
        if (this.checkUserExist(user, this.state.owners)) {
          // if the user exists, toast a message
          toast.alert(`${user.name} already exists in ${personnelType}.`)
        } else {
          // if the user doesn't exist, add
          this.setState({ owners: [...this.state.owners, user] });
        }
      }

      if (operation === "remove") {
        this.setState({ owners: this.state.owners.filter(u => u.uuid !== user.uuid) });
      }
    } else if (personnelType === "Project Members") {
      if (operation === "add") {
        if (this.checkUserExist(user, this.state.members)) {
          // if the user exists, toast a message
          toast.alert(`${user.name} already exists in ${personnelType}.`)
        } else {
          this.setState({ members: [...this.state.members, user] });
        }
      }

      if (operation === "remove") {
        this.setState({ members: this.state.members.filter(u => u.uuid !== user.uuid) });
      }
    }
  }

  handleBatchMembersUpdate = (members) => {
    const unExistingMembers = [];
    for (const m of members) {
      if(!this.checkUserExist(m, this.state.members)) {
        unExistingMembers.push(m);
      }
    }
    this.setState({ members: [...this.state.members, ...unExistingMembers] });
  }

  handleAllMembersDelete = () => {
    this.setState({ members: [] });
  }

  getIDs = (users) => {
    return users.map(user => user.uuid);
  }

  handlePersonnelUpdate = () => {
    const personnelType = this.state.activeIndex === 1 ? "Project Owners" : "Project Members";
    this.setState({
      showSpinner: true,
      spinner: {
        text: `Updating ${personnelType}... This process may take a while. 
        Please feel free to use other portal features while waiting. You will receive 
        a message when the update is completed.`,
        btnText: "Back to Project List",
        btnPath: "/experiments#projects"
      }
    });

    const { data, owners, members } = this.state;
    const ownerIDs = this.getIDs(owners);
    const memberIDs = this.getIDs(members);

    try{
      // pass the arr of updated po/pm and the original pm/po
      updateProjectPersonnel(data.uuid, ownerIDs, memberIDs).then(() => {
        this.setState({
          showSpinner: false,
          spinner: {
            text: "",
            btnText: "",
            btnPath: ""
          }
        });
        toast.success(
          <ToastMessageWithLink
            projectId={data.uuid}
            message={`${personnelType} updated successfully.`}
          />,
          {autoClose: 10000,}
        );
      });
    } catch (err) {
      this.setState({
        showSpinner: false,
        spinner: {
          text: "",
          btnText: "",
          btnPath: ""
        }
      });
      toast(`Failed to update ${personnelType}.`)
    }

    this.props.navigate(`/projects/${data.uuid}`);
  }

  render() {
    const projectId = this.props.match.params.id;

    const {
      data,
      publicOptions,
      optionsDisplayMapping,
      user,
      globalRoles,
      originalProjectName,
      SideNavItems,
      activeIndex,
      owners,
      members,
      showSpinner,
      spinner,
      tagVocabulary,
      selectedTags,
      originalTags
    } = this.state;
    
    let canUpdate = globalRoles.isFacilityOperator || data.is_creator || data.is_owner;

    const urlSuffix = `email=${user.email}&customfield_10058=${data.uuid}&customfield_10059=${encodeURIComponent(data.name)}`;

    if (showSpinner) {
      return (
        <div className="container">
          <SpinnerFullPage
            showSpinner={showSpinner}
            text={spinner.text}
            btnText={spinner.btnText}
            btnPath={spinner.btnPath}
          />
        </div>
      )
    }

    if (data.is_locked) {
      return (
        <div className="container">
          <SpinnerFullPage
            showSpinner={true}
            text={"This project is locked because an update is in process. Please feel free to use other portal features while waiting. You will receive a message when the update is completed. "}
            btnText={"Back to Project list"}
            btnPath={"/experiments#projects"}
          />
        </div>
      )
    }

    // 1. New project.
    if (projectId === "new") {
      return (
        <div className="container">
          <NewProjectForm navigate={this.props.navigate} />
        </div>
      );
    } else if (!data.is_owner && !data.is_member && !data.is_creator && !globalRoles.isFacilityOperator) {
      // 2. view public project.
      return (
        <div className="container">
          <ProjectProfile
            project={data}
          />
        </div>
      )
    } else {
      // 3. Show detailed project form for PC/ PO/ PM or FO.
      return (
        <div className="container">
          <div className="d-flex flex-row justify-content-between">
            <h1>{originalProjectName}</h1>
            {
              canUpdate ?
              <div className="d-flex flex-row justify-content-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success mr-2 my-3"
                  onClick={() => window.open(
                    `${portalData.jiraLinks.projectPermissionRequest}?${urlSuffix}`,
                    "_blank")
                  }
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Request Permissions
                </button>
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success mr-2 my-3"
                  onClick={() => window.open(
                    `${portalData.jiraLinks.storageRequest}?${urlSuffix}`,
                    "_blank")
                  }
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Request Storage
                </button>
                <Link to="/experiments#projects">
                  <button
                    className="btn btn-sm btn-outline-primary my-3"
                  >
                    <i className="fa fa-sign-in mr-2"></i>
                    Back to Project List
                  </button>
                </Link>
              </div>
              :
              <Link to="/experiments#projects">
                <button
                  className="btn btn-sm btn-outline-primary my-3"
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Back to Project List
                </button>
              </Link>
            }
          </div>
          <div className="row mt-4">
            <SideNav
              items={SideNavItems}
              handleChange={this.handleSideNavChange}
            />
            <div
              className={`${activeIndex === 0 ? "col-9" : "d-none"}`}
            >
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("name", "Name", canUpdate)}
                {this.renderTextarea("description", "Description", canUpdate)}
                {this.renderSelect("facility", "Facility", canUpdate, data.facility, portalData.facilityOptions)}
                {this.renderSelect("is_public", "Public", canUpdate, data.is_public, publicOptions, portalData.helperText.publicProjectDescription)}
                {
                  data.is_public === "Yes" && 
                  this.renderInputCheckBoxes("preferences", "Privacy Preferences",
                    canUpdate, optionsDisplayMapping,
                    portalData.helperText.privacyPreferencesDescription
                  )}
                {canUpdate && this.renderButton("Save")}
              </form>
              <ProjectBasicInfoTable
                project={data}
                projectTags={originalTags}
                canUpdate={canUpdate}
                onDeleteProject={this.handleDeleteProject}
              />
              {
                globalRoles.isFacilityOperator && <div className="mt-2">
                  <h4>Project Permissions</h4>
                  <InputCheckboxes
                    allOptions={tagVocabulary}
                    selectedOptions={selectedTags}
                    showSelectAll={true}
                    optionDirection={"column"}
                    onCheck={this.handleTagCheck}
                    key={`project-permissions-${selectedTags.length}`}
                  />
                  <button
                    className="btn btn-primary mt-2"
                    onClick={this.handlePermissionUpdate}
                  >
                    Update Permissions
                  </button>
                </div>
              }
            </div>
            <div
              className={`${
                activeIndex === 1
                  ? "col-9 d-flex flex-row" : "d-none"
              }`}
            >
              <div className="w-100">
                <ProjectPersonnel
                  personnelType={"Project Owners"}
                  canUpdate={canUpdate}
                  users={owners}
                  onSinglePersonnelUpdate={this.handleSinglePersonnelUpdate}
                  onPersonnelUpdate={this.handlePersonnelUpdate}
                />
              </div>
            </div>
            <div
              className={`${
                activeIndex === 2
                  ? "col-9 d-flex flex-row" : "d-none"
              }`}
            >
              <div className="w-100">
                <ProjectPersonnel
                  personnelType={"Project Members"}
                  canUpdate={canUpdate}
                  users={members}
                  onSinglePersonnelUpdate={this.handleSinglePersonnelUpdate}
                  onPersonnelUpdate={this.handlePersonnelUpdate}
                  onBatchMembersUpdate={this.handleBatchMembersUpdate}
                  onAllMembersDelete={this.handleAllMembersDelete}
                />
              </div>
            </div>
            <div
              className={`${
                activeIndex === 3
                  ? "col-9 d-flex flex-row" : "d-none"
              }`}
            >
              <div className="w-100">
                <ProjectTokenHolders
                  token_holders={this.state.token_holders}
                  urlSuffix={urlSuffix}
                  isTokenHolder={data.is_token_holder}
                />
              </div>
            </div>
            <div
              className={`${
                activeIndex === 4
                  ? "col-9 d-flex flex-row" : "d-none"
              }`}
            >
              <div className="w-100">
                {
                  activeIndex === 3 && <Slices
                    parent="Projects"
                    projectId={data.uuid}
                  />
                }
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default withRouter(ProjectForm);