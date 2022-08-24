import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Form from "../components/common/Form/Form";
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

import { 
  getProjectById,
  getProjectTags,
  deleteProject,
  updateProject,
  updateTags,
} from "../services/projectService";

class projectForm extends Form {
  state = {
    data: {
      uuid: "",
      name: "",
      description: "",
      facility: "",
      tags: [],
      created: "",
      creator_name: "",
      creator_id: "",
      creator_email: "",
      is_creator: false,
      is_member: false,
      is_owner: false,
      is_public: false,
    },
    publicOptions: [
      { "_id": 1, "name": "Yes" },
      { "_id": 2, "name": "No" }
    ],
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
    ],
    originalProjectName: "",
    originalTags: [],
    owners: [],
    members: [],
    tagVocabulary: [],
    showSpinner: false,
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    tags: Joi.array(),
    created: Joi.string().allow(""),
    creator_name: Joi.string().allow(""),
    creator_id: Joi.string().allow(""),
    creator_email: Joi.string().allow(""),
    is_creator: Joi.boolean(),
    is_member: Joi.boolean(),
    is_owner: Joi.boolean(),
    is_public: Joi.boolean().label("Public")
  };

  async populateProject() {
    this.setState({ showSpinner: true, spinnerText: `Loading project...`  });

    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") {
        this.setState({ showSpinner: false, spinnerText: ""  });
        return;
      }

      const { data } = await getProjectById(projectId);

      const project = data.results[0];
      // keep a shallow copy of project name for project form header
      this.state.originalProjectName = project.name;
      // keep a copy of original tags for comparing on submit.
      this.state.originalTags = project.tags;
      this.setState({ 
        data: this.mapToViewModel(project), 
        owners: project.project_owners, 
        members: project.project_members,
        showSpinner: false,
        spinnerText: ""
      });
    } catch (err) {
      toast.error("Failed to load project.");
      if (err.response && err.response.status === 404) {
        this.props.history.replace("/not-found");
      }
    }
  }

  async componentDidMount() {
    await this.populateProject();

    try {
      const { data: res1 } = await getProjectTags();
      const tags = res1.results;
      this.setState({ tagVocabulary: tags });
    } catch (err) {
      toast.error("Failed to get tags.");
    }

    try {
      const { data: res2 } = await getCurrentUser();
      this.setState({ user: res2.results[0], globalRoles: checkGlobalRoles(res2.results[0]) });
    } catch (err) {
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
      tags: project.tags,
      created: project.created,
      creator_name: project.project_creators[0].name,
      creator_id: project.project_creators[0].uuid,
      creator_email: project.project_creators[0].email,
      is_creator: project.memberships.is_creator,
      is_member: project.memberships.is_member,
      is_owner: project.memberships.is_owner,
      is_public: project.is_public ? "Yes" : "No"
    };
  }

  doSubmit = async () => {
    this.setState({ showSpinner: true, spinnerText: `Updating project...`  });

    const { data: project } = this.state;
    try {
      await updateProject(project);
      await updateTags(project.uuid, project.tags);

      this.setState({ showSpinner: false, spinnerText: ""  });
      toast.success("Project updated successfully!");
    }
    catch (err) {
      toast.error("Failed to save project.");
    }

    this.props.history.push(`/projects/${project.uuid}`);
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

  handleDeleteProject = async (project) => {
    try {
      // redirect users directly to the projects page
      this.props.history.push("/projects");
      toast.info("Deletion request is in process. You'll receive a message when the project is successfully deleted.")
      // while the async call is processing under the hood
      await deleteProject(project.uuid);
      // toast message to users when the api call is successfully done.
      toast.success("Project deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete project.");
      this.props.history.push("/projects");
    }
  };

  handleSinglePersonnelUpdate = (personnelType, user, operation) => {
    // personnelType: "Project Owner" / "Project Member"
    // operation: "add" / "remove"
    if (personnelType === "Project Owners") {
      if (operation === "add") {
        this.setState({ owners: [...this.state.owners, user] });
      }

      if (operation === "remove") {
        this.setState({ owners: this.state.owners.filter(u => u.uuid !== user.uuid) });
      }
    } else if (personnelType === "Project Members") {
      if (operation === "add") {
        this.setState({ members: [...this.state.members, user] });
      }

      if (operation === "remove") {
        this.setState({ members: this.state.members.filter(u => u.uuid !== user.uuid) });
      }
    }
  }

  getIDs = (users) => {
    return users.map(user => user.uuid);
  }

  handlePersonnelUpdate = () => {
    const personnelType = this.state.activeIndex === 1 ? "Project Owners" : "Project Members";
    
    this.setState({ showSpinner: true, spinnerText: `Updating ${personnelType}...`  });

    const { data, owners, members } = this.state;
    const ownerIDs = this.getIDs(owners);
    const memberIDs = this.getIDs(members);

    try{
      // pass the arr of updated po/pm and the original pm/po
      updateProjectPersonnel(data.uuid, ownerIDs, memberIDs).then(() => {
        this.setState({ showSpinner: false, spinnerText: ""  });
        toast.success(`${personnelType} updated successfully.`);
      });
    } catch (err) {
      toast(`Failed to update ${personnelType}.`)
    }

    this.props.history.push(`/projects/${data.uuid}`);
  }

  render() {
    const projectId = this.props.match.params.id;

    const {
      data,
      publicOptions,
      user,
      globalRoles,
      originalProjectName,
      SideNavItems,
      activeIndex,
      owners,
      members,
      showSpinner,
      spinnerText,
    } = this.state;

    // ***** Conditional Rendering Project Form *****
    // only facility operator or project creator
    // can update project/ delete project/ update owner;
    let canUpdate = globalRoles.isFacilityOperator || data.is_creator;
    // only facility operator or project owner can update member;
    let canUpdateMember = canUpdate || data.is_owner;

    const parsedTags = this.parseTags();
    const urlSuffix = `email=${user.email}&customfield_10058=${data.uuid}&customfield_10059=${encodeURIComponent(data.name)}`;

    if (showSpinner) {
      return (
        <div className="container">
          <SpinnerFullPage text={spinnerText} showSpinner={showSpinner}/>
        </div>
      )
    }

    // 1. New project.
    if (projectId === "new") {
      return (
        <div className="container">
          <NewProjectForm
            history={this.props.history}
            isFacilityOperator={globalRoles.isFacilityOperator}
            baseOptions={parsedTags.baseOptions}
            optionsMapping={parsedTags.optionsMapping}
          />
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
      // 3. Show detailed project form for PO/ PM or FO.
      return (
        <div className="container">
          <div className="d-flex flex-row justify-content-between">
            <h1>{originalProjectName}</h1>
            {
              canUpdateMember ?
              <div className="d-flex flex-row justify-content-end">
                <button
                  type="button"
                  className="btn btn-sm btn-outline-success mr-2 my-3"
                  onClick={() => window.open(
                    `${portalData.jiraProjectPermissionLink}?${urlSuffix}`,
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
                    `${portalData.jiraStorageRequestLink}?${urlSuffix}`,
                    "_blank")
                  }
                >
                  <i className="fa fa-sign-in mr-2"></i>
                  Request Storage
                </button>
                <Link to="/projects">
                  <button
                    className="btn btn-sm btn-outline-primary my-3"
                  >
                    <i className="fa fa-sign-in mr-2"></i>
                    Back to Project List
                  </button>
                </Link>
              </div>
              :
              <Link to="/projects">
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
              className={`${activeIndex !== 0 ? "d-none" : "col-9"}`}
            >
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("name", "Name", canUpdate)}
                {this.renderTextarea("description", "Description", canUpdate)}
                {this.renderSelect("facility", "Facility", canUpdate, data.facility, portalData.facilityOptions)}
                {this.renderSelect("is_public", "Public", canUpdate, data.is_public, publicOptions)}
                {globalRoles.isFacilityOperator && this.renderProjectTags("tags", "Project Permissions", parsedTags.baseOptions, parsedTags.optionsMapping)}
                {canUpdate && this.renderButton("Save")}
              </form>
              {
                <ProjectBasicInfoTable
                  project={data}
                  canUpdate={canUpdate}
                  onDeleteProject={this.handleDeleteProject}
                />
              }
            </div>
            <div
              className={`${
                activeIndex !== 1
                  ? "d-none"
                  : "col-9 d-flex flex-row"
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
                activeIndex !== 2
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-100">
                <ProjectPersonnel
                  personnelType={"Project Members"}
                  canUpdate={canUpdateMember}
                  users={members}
                  onSinglePersonnelUpdate={this.handleSinglePersonnelUpdate}
                  onPersonnelUpdate={this.handlePersonnelUpdate}
                />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default projectForm;