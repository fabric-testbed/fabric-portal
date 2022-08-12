import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Form from "../components/common/Form";
import SideNav from "../components/common/SideNav";
import ProjectPersonnel from "../components/Project/ProjectPersonnel";
import ProjectBasicInfoTable from "../components/Project/ProjectBasicInfoTable";
import NewProjectForm from "../components/Project/NewProjectForm";
import { toast } from "react-toastify";
import { default as portalData } from "../services/portalData.json";
import { getCurrentUser } from "../services/peopleService.js";
import checkGlobalRoles from "../utils/checkGlobalRoles"; 
import SpinnerWithText from "../components/common/SpinnerWithText";

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
      name: "",
      uuid: "",
      description: "",
      facility: "",
      created_by: {},
      created_time: "",
      project_creators: [],
      project_owners: [],
      project_members: [],
      tags: [],
      memberships: {
        is_creator: false,
        is_member: false,
        is_owner: false
      },
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
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: false,
    },
    showSpinner: false
  };

  schema = {
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    tags: Joi.array(),
  };

  async populateProject() {
    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") return;

      const { data } = await getProjectById(projectId);

      this.setState({ showSpinner: false });

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
    this.setState({ showSpinner: true });
    
    await this.populateProject();

    try {
      const { data: res1 } = await getProjectTags();
      const tags = res1.results;
      this.setState({ tagVocabulary: tags });
    } catch (ex) {
      toast.error("Failed to get tags.");
      console.log(ex.response.data);
    }

    try {
      const { data: res2 } = await getCurrentUser();
      this.setState({ globalRoles: checkGlobalRoles(res2.results[0])});
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
      memberships: project.memberships
    };
  }

  doSubmit = async () => {
    try {
      await updateProject(this.state.data);
      await updateTags(this.state.originalTags, this.state.data);
    }
    catch (ex) {
      console.log("failed to save project: " + ex.response.data);
      toast.error("Failed to save project.");
      this.props.history.push("/projects");
    }

    toast.success("Project updated successfully!");
    this.props.history.push(`/slices/${this.state.data.uuid}`);
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
    } catch (ex) {
      if (ex.response && ex.response.status === 404) {
        console.log("This project has been deleted.");
      }
      console.log("failed to delete project: " + ex.response.data);
      toast.error("Failed to delete project.");
      this.props.history.push("/projects");
    }
  };

  handleDelete = (user) => {
    if (this.state.activeIndex === 1) {
      const originalUsers = this.state.data.project_owners;
      // update the state of the component.
      // create a new users array without current selected user.
      const users = originalUsers.filter((u) => {
        return u.uuid !== user.uuid;
      });

      // new projects obj will overwrite old one in state
      this.setState({ data: { ...this.state.data, project_owners: users } });
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
    }
  };


  render() {
    const projectId = this.props.match.params.id;

    if (this.state.showSpinner) {
      return <div className="h-75">
        <SpinnerWithText text={"Loading updates..."} />
      </div>
    } else {
      const {
        data,
        originalProjectName,
        SideNavItems,
        activeIndex,
        globalRoles
      } = this.state;
  
      // ***** Conditional Rendering Project Form *****
      // only facility operator or project creator
      // can update project/ delete project/ update owner;
      let canUpdate = globalRoles.isFacilityOperator || data.memberships.is_creator;
      // only facility operator or project owner can update member;
      let canUpdateMember = globalRoles.isFacilityOperator || data.memberships.is_owner;
      
      const parsedTags = this.parseTags();
  
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
                  {globalRoles.isFacilityOperator && this.renderProjectTags("tags", "Tags", parsedTags.baseOptions, parsedTags.optionsMapping)}
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
                  <ProjectPersonnel
                    personnelType={"Project Owners"}
                    canUpdate={canUpdate}
                    project={data}
                    users={data.project_owners}
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
                <div className="w-75">
                  <ProjectPersonnel
                    personnelType={"Project Members"}
                    canUpdate={canUpdateMember}
                    project={data}
                    users={data.project_members}
                  />
                </div>
              </div>
            </div>
          </div>
        );
      }
    }
  }
}

export default projectForm;