import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import withRouter from "../components/common/withRouter.jsx";
import Form from "../components/common/Form/Form";
import InputCheckboxes from "../components/common/InputCheckboxes";
import SideNav from "../components/common/SideNav";
import ProjectMemberships from "../components/Project/Personnel/ProjectMemberships";
import ProjectProfile from "../components/Project/ProjectProfile";
import ProjectBasicInfoTable from "../components/Project/ProjectBasicInfoTable";
import PersistentStorage from "../components/Project/Storage/PersistentStorage.jsx";
import NewProjectForm from "../components/Project/NewProjectForm";
import { toast } from "react-toastify";
import { default as portalData } from "../services/portalData.json";
import { getCurrentUser } from "../services/peopleService.js";
import checkGlobalRoles from "../utils/checkGlobalRoles"; 
import SpinnerFullPage from "../components/common/SpinnerFullPage";
import Slices from "../components/Experiment/Slices";
import moment from 'moment';
import utcToLocalTimeParser from "../utils/utcToLocalTimeParser.js";
import {
  getProjectById,
  getProjectTags,
  deleteProject,
  updateProject,
  updateTags,
  updateProjectPersonnel,
  updateProjectTokenHolders,
  updateProjectCommunity,
  updateProjectFunding,
  updateMatrix,
  updateProjectTopics
} from "../services/projectService";

const ToastMessageWithLink = ({projectId, message}) => (
  <div className="ms-2">
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
    originalProject: { name: "", profile: { references: [] }},
    data: {
      uuid: "",
      name: "",
      description: "",
      facility: "",
      tags: [],
      expired: "",
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
      project_type: "research",
      allOptions: [
        "show_project_owners",
        "show_project_members",
      ],
      selectedOptions: [],
      project_funding: [],
      communities: [],
      topics: []
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
      { name: "PROJECT MEMBERSHIPS", active: false },
      { name: "SLICES", active: false },
      { name: "PERSISTENT STORAGE", active: false },
    ],
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
    originalTags: [],
    projectFunding: [],
    communities: [],
    fabricMatrix: ""
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    tags: Joi.array(),
    expired: Joi.string().allow(""),
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
    project_type: Joi.string().required().label("Project Type"),
    is_locked: Joi.boolean(),
    allOptions: Joi.array(),
    selectedOptions: Joi.array(),
    project_funding: Joi.array(),
    communities: Joi.array()
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
      const project = data.results[0];

      // check if view as public profile (user is not PC/PO/PM/FO)
      if(project.memberships && !project.memberships.is_creator && 
        !project.memberships.is_member && !project.memberships.is_owner &&
        !this.state.globalRoles.isFacilityOperator) {
          this.setState({
            data: project,
            fabricMatrix: project.profile.references.length > 0 ? project.profile.references["fabric_matrix"] : "",
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
          originalProject: project,
          data: this.mapToViewModel(project),
          fabricMatrix: project.profile.references.length > 0 ? project.profile.references[0].url : "",
          projectFunding: project.project_funding,
          communities: project.communities,
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
       "#memberships": 1,
       "#slices": 2,
       "#volumes": 3
     }
 
     if (hash) {
       this.setState({ activeIndex: activeMap[hash] });
       this.setState({ SideNavItems: [
         { name: "BASIC INFORMATION", active: hash === "#info" },
         { name: "PROJECT MEMBERSHIPS", active: hash === "#memberships" },
         { name: "SLICES", active: hash === "#slices" },
         { name: "PERSISTENT STORAGE", active: hash === "#volumes"}
       ]})
     }
     
    try {
      const { data: res1 } = await getProjectTags();
      const tags = res1.results;
      this.setState({ tagVocabulary: tags  });
    } catch (err) {
      toast.error("Failed to get tags.");
    }

    try {
      const { data: res2 } = await getCurrentUser();
      this.setState({ user: res2.results[0], globalRoles: checkGlobalRoles(res2.results[0]) });
    } catch (err) {
      toast.error("User's credential is expired. Please re-login.");
      this.props.navigate("/experiments#projects");
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
      expired: project.expires_on,
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
      project_type: project.project_type,
      is_locked: project.is_locked,
      allOptions: [
        "show_project_owners",
        "show_project_members",
      ],
      selectedOptions: Object.keys(project.preferences).filter(key => 
        project.preferences[key] && this.state.allOptions.includes(key)),
      project_funding: project.project_funding,
      communities: project.communities
    };
  }

  parsePreferences = () => {
    const preferences = {};

    for (const option of this.state.allOptions) {
      preferences[option] = this.state.data.selectedOptions.includes(option);
    }

    return preferences;
  }

  handleUpdateProject= async () => {
    this.setState({
      showSpinner: true,
      spinner: {
        text: "Updating project...",
        btnText: "",
        btnPath: ""
      }
    });

    const { data: project, projectFunding, communities, fabricMatrix, topics, originalProject } = this.state;
    const originalMatrix = originalProject.profile.references.length > 0 ? originalProject.profile.references[0].url : "";
    try {
      await updateProject(project, this.parsePreferences());
      await updateProjectFunding(project.uuid, projectFunding);
      await updateProjectCommunity(project.uuid, communities);
      await updateProjectTopics(project.uuid, topics);
      if (fabricMatrix !== originalMatrix) {
        await updateMatrix(project.uuid, fabricMatrix);
      }
      window.location.reload();
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

  handleUpdateFunding = (operation, funding) => {
    if (operation === "add") {
      const fundings = this.state.projectFunding;
      fundings.push(funding);
      this.setState({ projectFunding: fundings });
    } else if (operation === "remove") {
      const newFundings = [];
      for (const f of this.state.projectFunding) {
        if (JSON.stringify(f) !== JSON.stringify(funding)) {
          newFundings.push(f);
        }
      }
      this.setState({ projectFunding: newFundings });
    }
  }

  handleUpdateCommunity = (operation, community) => {
    if (operation === "add") {
      const communities = this.state.communities;
      communities.push(community);
      this.setState({ communities: communities });
    } else if (operation === "remove") {
      const newCommunities = [];
      for (const c of this.state.communities) {
        if (c !== community) {
          newCommunities.push(c);
        }
      }
      this.setState({ communities: newCommunities });
    }
  }

  handleUpdateMatrix = (e) => {
    this.setState({ fabricMatrix:  e.target.value });
  }

  handleTopicsUpdate = (topics) => {
    this.setState({ topics })
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
      1: "#memberships",
      2: "#slices",
      3: "#volumes",
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

  handlePersonnelUpdate = (personnelType, userIDs, operation) => {
    const { data } = this.state;
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

    try{
      // pass the arr of updated po/pm and the original pm/po
      updateProjectPersonnel(data.uuid, userIDs, operation, personnelType).then(() => {
        this.setState({
          showSpinner: false,
          spinner: {
            text: "",
            btnText: "",
            btnPath: ""
          }
        });
        // user waits the API call on the spinner UI
        // reload the page to get updated data
        if (window.location.href.includes("fabric-testbed.net/projects/")) {
          window.location.reload();
        } else {
          // user may switch to other pages
          // toast a success message with link to the updated project
          toast.success(
            <ToastMessageWithLink
              projectId={data.uuid}
              message={`${personnelType} updated successfully.`}
            />,
            {autoClose: 10000}
          );
        }
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
  }

  handleUpdateTokenHolders = (personnelType, tokenHolderIDs, operation) => {
    const { data } = this.state;
    this.setState({
      showSpinner: true,
      spinner: {
        text: `Updating token holders... This process may take a while. 
        Please feel free to use other portal features while waiting. You will receive 
        a message when the update is completed.`,
        btnText: "Back to Project List",
        btnPath: "/experiments#projects"
      }
    });

    try{
      // pass the arr of updated po/pm and the original pm/po
      updateProjectTokenHolders(data.uuid, operation, tokenHolderIDs).then(() => {
        this.setState({
          showSpinner: false,
          spinner: {
            text: "",
            btnText: "",
            btnPath: ""
          }
        });
        // user waits the API call on the spinner UI
        // reload the page to get updated data
        if (window.location.href.includes("fabric-testbed.net/projects/")) {
          window.location.reload();
        } else {
          // user may switch to other pages
          // toast a success message with link to the updated project
          toast.success(
            <ToastMessageWithLink
              projectId={data.uuid}
              message={`Project updated successfully.`}
            />,
            {autoClose: 10000}
          );
        }
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
      toast(`Failed to add token holders.`)
    }
  }

  checkProjectExpiration = (expirationTime) => {
    if (expirationTime) {
      const utcDateTime = expirationTime.substring(0, 19);
      const stillUtc = moment.utc(utcDateTime).toDate();
      return stillUtc < new Date();
    }
  }

  checkProjectExpireInOneMonth = (expirationTime) => {
    if (expirationTime) {
      const utcDateTime = expirationTime.substring(0, 19);
      const stillUtc = moment.utc(utcDateTime).toDate();
      return stillUtc < moment(new Date()).add(1, 'M');
    }
  }

  render() {
    const projectId = this.props.match.params.id;

    const {
      data,
      publicOptions,
      optionsDisplayMapping,
      user,
      globalRoles,
      SideNavItems,
      activeIndex,
      owners,
      members,
      showSpinner,
      spinner,
      tagVocabulary,
      selectedTags,
      originalTags,
      volumes,
      projectFunding,
      communities,
      fabricMatrix,
      originalProject,
      topics
    } = this.state;
    
    let canUpdate = !this.checkProjectExpiration(data.expired) && 
     (globalRoles.isFacilityOperator || data.is_creator || data.is_owner);

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

    if (data.is_locked && !this.checkProjectExpiration(data.expired)) {
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
            <h1>{originalProject.name}</h1>
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
          {
            this.checkProjectExpiration(data.expired) &&
            <div
              className="alert alert-danger mb-2 d-flex flex-row justify-content-between align-items-center" 
              role="alert"
            >
              <span>
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This project is expired and no operations are allowed. Please submit a ticket to renew the project.
              </span>
              <button
                type="button"
                className="btn btn-sm btn-success"
                onClick={() => window.open(
                  `${portalData.jiraLinks.renewProjectRequest}?${urlSuffix}`,
                  "_blank")
                }
              >
                <i className="fa fa-sign-in mr-2"></i>
                Renew Project
              </button>
            </div>
          }
          {
            !this.checkProjectExpiration(data.expired) && 
            this.checkProjectExpireInOneMonth(data.expired) &&
            <div
              className="alert alert-warning mb-2 d-flex flex-row justify-content-between align-items-center" 
              role="alert"
            >
              <div>
                <i className="fa fa-exclamation-triangle mr-2"></i>
                This project is going to expire in a month on {utcToLocalTimeParser(data.expired)}. 
                {
                  canUpdate ? <span> Please submit a ticket to renew the project.</span> : 
                  <span> Please contact your project owner to request project renewal.</span>
                }
              </div>
              {
                canUpdate ? <button
                    type="button"
                    className="btn btn-sm btn-success"
                    onClick={() => window.open(
                      `${portalData.jiraLinks.renewProjectRequest}?${urlSuffix}`,
                      "_blank")
                    }
                  >
                    <i className="fa fa-sign-in mr-2"></i>
                    Renew Project
                  </button> : <div></div>
              }
            </div>
          }
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
                  {this.renderWysiwyg("description", "Description", canUpdate)}
                  {this.renderSelect("facility", "Facility", canUpdate, data.facility, portalData.facilityOptions)}
                  {this.renderSelect("is_public", "Public", canUpdate, data.is_public, publicOptions, portalData.helperText.publicProjectDescription)}
                  {this.renderSelect("project_type", "Project Type", canUpdate, data.project_type, portalData.projectTypeOptions)}
                  {
                    data.is_public === "Yes" && 
                    this.renderInputCheckBoxes("preferences", "Privacy Preferences",
                      canUpdate, optionsDisplayMapping,
                      portalData.helperText.privacyPreferencesDescription
                    )
                  }
                  {
                    this.renderInputTag("topics", "Project Topics", topics, canUpdate)
                  }
              </form>
              <ProjectBasicInfoTable
                project={data}
                projectTags={originalTags}
                projectFunding={projectFunding}
                fabricMatrix={fabricMatrix}
                communities={communities}
                topics={topics}
                canUpdate={canUpdate}
                isFO={globalRoles.isFacilityOperator}
                onDeleteProject={this.handleDeleteProject}
                onFundingUpdate={this.handleUpdateFunding}
                onMatrixUpdate={this.handleUpdateMatrix}
                onCommunityUpdate={this.handleUpdateCommunity}
                onTopicsUpdate={this.handleTopicsUpdate}
                onUpdateProject={this.handleUpdateProject}
              />
              {
                globalRoles.isFacilityOperator && <div className="border-top my-2">
                  <h5 className="my-2">Project Permissions</h5>
                  <InputCheckboxes
                    allOptions={tagVocabulary}
                    selectedOptions={selectedTags}
                    showSelectAll={true}
                    optionDirection={"row"}
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
                <ProjectMemberships
                  canUpdate={canUpdate}
                  owners={owners}
                  members={members}
                  token_holders={this.state.token_holders}
                  urlSuffix={urlSuffix}
                  isTokenHolder={data.is_token_holder}
                  isFO={globalRoles.isFacilityOperator}
                  projectExpired={this.checkProjectExpiration(data.expired)}
                  onUpdateTokenHolders={this.handleUpdateTokenHolders}
                  onUpdateUsers={this.handlePersonnelUpdate}
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
                {
                  activeIndex === 2 && <Slices
                    parent="Projects"
                    projectId={data.uuid}
                    isProjectExpired={this.checkProjectExpiration(data.expired)}
                  />
                }
              </div>
            </div>
            <div
              className={`${
                activeIndex === 3
                  ? "col-9 d-flex flex-row" : "d-none"
              }`}
            >
              <div className="w-100">
                {
                  activeIndex === 3 && <PersistentStorage
                    parent="Projects"
                    projectId={data.uuid}
                    volumes={volumes}
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