import React from "react";
import Joi from "joi-browser";
import { Link } from "react-router-dom";
import Form from "../components/common/Form/Form";
import InputCheckboxes from "../components/common/InputCheckboxes";
import SideNav from "../components/common/SideNav";
import ProjectPersonnel from "../components/Project/ProjectPersonnel";
import ProjectProfile from "../components/Project/ProjectProfile";
import ProjectBasicInfoTable from "../components/Project/ProjectBasicInfoTable";
import NewProjectForm from "../components/Project/NewProjectForm";
import Slices from "../components/Experiment/Slices";
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
      modified: "",
      created: "",
      creator_name: "",
      creator_id: "",
      creator_email: "",
      is_creator: false,
      is_member: false,
      is_owner: false,
      is_public: false,
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
      { name: "SLICES", active: false },
      
    ],
    originalProjectName: "",
    owners: [],
    members: [],
    tagVocabulary: [],
    showSpinner: false,
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
    is_public: Joi.string().required().label("Public"),
    allOptions: Joi.array(),
    selectedOptions: Joi.array()
  };

  // async populateProject() {
  //   this.setState({ showSpinner: true, spinnerText: `Loading project...`  });

  //   try {
  //     const projectId = this.props.match.params.id;
  //     if (projectId === "new") {
  //       this.setState({ showSpinner: false, spinnerText: ""  });
  //       return;
  //     }

  //     const { data } = await getProjectById(projectId);

  //     const project = data.results[0];
  //     // keep a shallow copy of project name for project form header
  //     this.state.originalProjectName = project.name;

  //     // check if view as public profile (user is not PC/PO/PM/FO)
  //     if(project.memberships && !project.memberships.is_creator && 
  //       !project.memberships.is_member && !project.memberships.is_owner &&
  //       !this.state.globalRoles.isFacilityOperator) {
  //         this.setState({ 
  //           data: project, 
  //           showSpinner: false,
  //           spinnerText: ""
  //         });
  //     } else {
  //       // user is po/pm/pc or Facility Operator.
  //       this.setState({ 
  //         data: this.mapToViewModel(project), 
  //         owners: project.project_owners, 
  //         members: project.project_members,
  //         showSpinner: false,
  //         spinnerText: "",
  //         selectedTags: project.tags,
  //         originalTags: project.tags
  //       });
  //     }
  //   } catch (err) {
  //     toast.error("Failed to load project.");
  //     if (err.response && err.response.status === 404) {
  //       this.props.history.replace("/not-found");
  //     }
  //   }
  // }

  componentDidMount() {
    const user =  {
      "affiliation": "University of North Carolina at Chapel Hill",
      "bastion_login": "yaxueguo_0026542073",
      "cilogon_email": "yaxueguo@renci.org",
      "cilogon_family_name": "Guo",
      "cilogon_given_name": "Yaxue",
      "cilogon_id": "http://cilogon.org/serverT/users/26542073",
      "cilogon_name": "Yaxue Guo",
      "email": "yaxueguo@renci.org",
      "email_addresses": [
        "yaxueguo@renci.org"
      ],
      "eppn": "yaxue@unc.edu",
      "fabric_id": "FABRIC1000004",
      "name": "Yaxue Guo",
      "preferences": {
        "show_email": true,
        "show_eppn": false,
        "show_profile": true,
        "show_publications": true,
        "show_roles": true,
        "show_sshkeys": false
      },
      "profile": {
        "bio": "I'm the front-end developer of FABRIC project.",
        "job": "Front-end Developer",
        "other_identities": [],
        "personal_pages": [],
        "preferences": {
          "show_bio": true,
          "show_cv": true,
          "show_job": true,
          "show_other_identities": true,
          "show_personal_pages": true,
          "show_pronouns": false,
          "show_website": true
        },
        "pronouns": "She/her",
        "website": "https://github.com/yaxue1123"
      },
      "publications": [],
      "registered_on": "2021-07-14 13:39:13.541644+00:00",
      "roles": [
        {
          "description": "FABRIC Staff No Permissions",
          "name": "04b14c17-e66a-4405-98fc-d737717e2160-pm"
        },
        {
          "description": "Yaxue's Project",
          "name": "06e8d02a-b27f-4437-829e-8378d20e5a08-pc"
        },
        {
          "description": "Yaxue's Project",
          "name": "06e8d02a-b27f-4437-829e-8378d20e5a08-po"
        },
        {
          "description": "FABRIC Staff",
          "name": "990d8a8b-7e50-4d13-a3be-0f133ffa8653-pm"
        },
        {
          "description": "Laura's UI/Teaching Project",
          "name": "d66ce3fa-041f-4d08-a8ca-c886c30c468a-pm"
        },
        {
          "description": "Active Users of FABRIC - initially set by enrollment workflow",
          "name": "fabric-active-users"
        },
        {
          "description": "Jupyterhub access - based on project participation",
          "name": "Jupyterhub"
        },
        {
          "description": "Portal Administrators for FABRIC",
          "name": "portal-admins"
        },
        {
          "description": "Project Leads for FABRIC",
          "name": "project-leads"
        }
      ],
      "sshkeys": [
        {
          "comment": "yaxue-test-sliver-key",
          "created_on": "2022-06-08 15:28:51.592639+00:00",
          "description": "yaxue-test-sliver-key",
          "expires_on": "2024-06-07 15:28:51.592639+00:00",
          "fabric_key_type": "sliver",
          "fingerprint": "MD5:67:ac:e4:f7:4e:f2:62:86:e3:b8:c1:a5:15:68:b2:2e",
          "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBFkGY7pH/am+gMVDYK5RKP/+jCXUhlWWVZ3UCZcEK1WmIEpPXf8I8vk5tyNsNFKk9dkBpaHqrFQd6QgOwxzwiMM=",
          "ssh_key_type": "ecdsa-sha2-nistp256",
          "uuid": "e53083f8-b4b9-4c06-a282-ce0a080cd2a4"
        },
        {
          "comment": "yaxue-key-sliver",
          "created_on": "2022-09-20 17:03:08.780276+00:00",
          "description": "yaxue-key-sliver",
          "expires_on": "2024-09-19 17:03:08.780304+00:00",
          "fabric_key_type": "sliver",
          "fingerprint": "MD5:02:8b:3d:7d:68:93:9a:ef:78:b9:3f:01:fe:2f:5a:e1",
          "public_key": "AAAAE2VjZHNhLXNoYTItbmlzdHAyNTYAAAAIbmlzdHAyNTYAAABBBETrjGgRMKqvwE5UFqnJZ88SR2IweNGjHJ73HovkZlaGtT9PHIq3sqmqMUmKI56lN5/WyFcWkqkCQW1d8lhg97E=",
          "ssh_key_type": "ecdsa-sha2-nistp256",
          "uuid": "92484012-92b3-4a68-89c6-e6b0e5ccd8b5"
        }
      ],
      "uuid": "6744e0c2-745b-4f41-9746-deb039fb00a0"
    }
    const tags = [
      "Component.FPGA",
      "Component.GPU",
      "Component.NVME",
      "Component.SmartNIC",
      "Component.Storage",
      "Net.AllFacilityPorts",
      "Net.FacilityPort.Chameleon-StarLight",
      "Net.FacilityPort.ESnet-StarLight",
      "Net.FacilityPort.Internet2-StarLight",
      "Net.NoLimitBW",
      "Net.Peering",
      "Net.PortMirroring",
      "Slice.Measurements",
      "Slice.Multisite",
      "Slice.NoLimitLifetime",
      "VM.NoLimit",
      "VM.NoLimitCPU",
      "VM.NoLimitDisk",
      "VM.NoLimitRAM"
    ]
    const project =   {
      "active": true,
      "created": "2022-06-20 20:46:11.521332+00:00",
      "description": "This project in production portal is for front-end testing purposes.",
      "facility": "FABRIC",
      "is_public": true,
      "memberships": {
        "is_creator": true,
        "is_member": false,
        "is_owner": true
      },
      "modified": "2022-10-25 21:14:10.339342+00:00",
      "name": "Yaxue's Project",
      "preferences": {
        "show_profile": true,
        "show_project_members": true,
        "show_project_owners": true,
        "show_publications": true
      },
      "profile": {
        "keywords": [],
        "notebooks": [],
        "preferences": {
          "show_award_information": true,
          "show_goals": true,
          "show_keywords": true,
          "show_notebooks": true,
          "show_project_status": true,
          "show_purpose": true,
          "show_references": true
        },
        "references": []
      },
      "project_creators": [
        {
          "email": "yaxueguo@renci.org",
          "name": "Yaxue Guo",
          "uuid": "6744e0c2-745b-4f41-9746-deb039fb00a0"
        }
      ],
      "project_members": [
        {
          "email": "paul.ruth@gmail.com",
          "name": "Paul Ruth",
          "uuid": "d2b028df-03e7-4aa4-994b-9ed3a174fe10"
        },
        {
          "name": "Michael J. Stealey, Sr",
          "uuid": "b12b961d-98ec-46f1-a938-af7a5ec0410b"
        }
      ],
      "project_owners": [
        {
          "email": "yaxueguo@renci.org",
          "name": "Yaxue Guo",
          "uuid": "6744e0c2-745b-4f41-9746-deb039fb00a0"
        },
        {
          "name": "Yaxue G",
          "uuid": "356a8962-6fd5-4669-871e-651a18afc46c"
        }
      ],
      "publications": [],
      "tags": [],
      "uuid": "06e8d02a-b27f-4437-829e-8378d20e5a08"
    }

    this.setState({
      user,
      tagVocabulary: tags,
      globalRoles: checkGlobalRoles(user),
      data: this.mapToViewModel(project),
      originalProjectName: project.name,
      owners: project.project_owners, 
      members: project.project_members,
      selectedTags: project.tags,
      originalTags: project.tags 
    });
  }

  // async componentDidMount() {
  //   try {
  //     const { data: res2 } = await getCurrentUser();
  //     this.setState({ user: res2.results[0], globalRoles: checkGlobalRoles(res2.results[0]) });
  //   } catch (err) {
  //     toast.error("User's credential is expired. Please re-login.");
  //     this.props.history.push("/projects");
  //   }

  //   try {
  //     const { data: res1 } = await getProjectTags();
  //     const tags = res1.results;
  //     this.setState({ tagVocabulary: tags  });
  //   } catch (err) {
  //     toast.error("Failed to get tags.");
  //   }

  //   await this.populateProject();
  // }

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
      is_public: project.is_public ? "Yes" : "No",
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
    this.setState({ showSpinner: true, spinnerText: `Updating project...`  });

    const { data: project } = this.state;
    try {
      await updateProject(project, this.parsePreferences());
      this.setState({
        showSpinner: false,
        spinnerText: "",
        originalProjectName: project.name
      });
      toast.success("Project updated successfully!");
    }
    catch (err) {
      this.setState({ showSpinner: false, spinnerText: ""  });
      toast.error("Failed to save project.");
    }

    this.props.history.push(`/projects/${project.uuid}`);
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
    this.setState({ showSpinner: true, spinnerText: `Updating project permissions...`  });
    try {
      await updateTags( project.uuid, selectedTags);
      this.setState({ originalTags: selectedTags });
      toast.success(`Permissions updated successfully.`);
    } catch (err) {
      toast.error("Failed to save project permissions.");
    }
    this.setState({ showSpinner: false, spinnerText: ""  });
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
      this.setState({ showSpinner: false, spinnerText: ""  });
      toast(`Failed to update ${personnelType}.`)
    }

    this.props.history.push(`/projects/${data.uuid}`);
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
      spinnerText,
      tagVocabulary,
      selectedTags,
      originalTags
    } = this.state;
    
    let canUpdate = globalRoles.isFacilityOperator || data.is_creator || data.is_owner;

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
          <NewProjectForm history={this.props.history} />
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
                  canUpdate={canUpdate}
                  users={members}
                  onSinglePersonnelUpdate={this.handleSinglePersonnelUpdate}
                  onPersonnelUpdate={this.handlePersonnelUpdate}
                />
              </div>
            </div>
            <div
              className={`${
                activeIndex !== 3
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-100">
                <Slices />
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default projectForm;