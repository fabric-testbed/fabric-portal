import React from "react";
import { Link } from "react-router-dom";
import SpinnerWithText from "../common/SpinnerWithText";
import Pagination from "../common/Pagination";
import ProjectsTable from "../Project/ProjectsTable";
import RadioBtnGroup from "../common/RadioBtnGroup";
import { getCurrentUser } from "../../services/peopleService.js";
import { getProjects } from "../../services/projectService.js";
import { default as portalData } from "../../services/portalData.json";
import checkGlobalRoles from "../../utils/checkGlobalRoles"; 
import toLocaleTime from "../../utils/toLocaleTime";
import { toast } from "react-toastify";

class Projects extends React.Component {
  state = {
    projects: [],
    projectsCount: 0,
    pageSize: 10,
    currentPage: 1,
    searchQuery: "",
    radioBtnValues: [
      { display: "My Projects", value: "myProjects", isActive: true },
      { display: "All Projects", value: "allProjects", isActive: false },
    ],
    globalRoles: {
      isProjectLead: false,
      isFacilityOperator: false,
      isActiveUser: false,
      isJupterhubUser: false,
    },
    showSpinner: false,
  };

  componentDidMount() {
    const { pageSize: limit } = this.state;
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
    const projectsCount = 4;
    let projects = [
      {
        "created": "2022-08-30 15:31:51.554716+00:00",
        "description": "This is a project with only basic permissions for testing for FABRIC Staff.",
        "facility": "FABRIC",
        "is_public": true,
        "memberships": {
          "is_creator": false,
          "is_member": true,
          "is_owner": false
        },
        "name": "FABRIC Staff No Permissions",
        "tags": [],
        "uuid": "04b14c17-e66a-4405-98fc-d737717e2160"
      },
      {
        "created": "2022-06-29 19:07:01.963160+00:00",
        "description": "This project is so I can test out portal functionality and determine how it supports teaching.",
        "facility": "FABRIC",
        "is_public": true,
        "memberships": {
          "is_creator": false,
          "is_member": true,
          "is_owner": false
        },
        "name": "Laura's UI/Teaching Project",
        "tags": [
          "Component.FPGA",
          "Component.GPU",
          "Component.NVME",
          "Component.SmartNIC",
          "Component.Storage",
          "Net.AllFacilityPorts",
          "Slice.Measurements",
          "Slice.Multisite",
          "Slice.NoLimitLifetime",
          "VM.NoLimit"
        ],
        "uuid": "d66ce3fa-041f-4d08-a8ca-c886c30c468a"
      },
      {
        "created": "2022-06-20 20:46:11.521332+00:00",
        "description": "This project in production portal is for front-end testing purposes.",
        "facility": "FABRIC",
        "is_public": true,
        "memberships": {
          "is_creator": true,
          "is_member": false,
          "is_owner": true
        },
        "name": "Yaxue's Project",
        "tags": [],
        "uuid": "06e8d02a-b27f-4437-829e-8378d20e5a08"
      },
      {
        "created": "2021-08-11 18:20:26+00:00",
        "description": "FABRIC Team",
        "facility": "FABRIC",
        "is_public": true,
        "memberships": {
          "is_creator": false,
          "is_member": true,
          "is_owner": false
        },
        "name": "FABRIC Staff",
        "tags": [
          "Component.FPGA",
          "Component.GPU",
          "Component.NVME",
          "Component.SmartNIC",
          "Component.Storage",
          "Net.AllFacilityPorts",
          "Net.NoLimitBW",
          "Net.Peering",
          "Net.PortMirroring",
          "Slice.Multisite",
          "Slice.Measurements",
          "VM.NoLimit",
          "VM.NoLimitDisk",
          "VM.NoLimitRAM",
          "VM.NoLimitCPU",
          "Net.FacilityPort.Chameleon-StarLight",
          "Net.FacilityPort.ESnet-StarLight",
          "Net.FacilityPort.Internet2-StarLight"
        ],
        "uuid": "990d8a8b-7e50-4d13-a3be-0f133ffa8653"
      }
    ]

    projects = projects.map((p) => {
      p.created_time  = toLocaleTime(p.created);
      return p;
    });

    this.setState({
      globalRoles: checkGlobalRoles(user),
      projects,
      projectsCount,
      showSpinner: false
    });
  }

  // async componentDidMount() {
  //   const { pageSize: limit } = this.state;
  //   this.setState({ showSpinner: true });

  //   try {
  //     const { data: res1 } = await getCurrentUser();
  //     const user = res1.results[0];
  //     const { data: res2 } = await getProjects("myProjects", 0, limit);
  //     const projectsCount = res2.total;
  //     let projects = res2.results;

  //     // parse create time field to user's local time.
  //     projects = projects.map((p) => {
  //       p.created_time  = toLocaleTime(p.created);
  //       return p;
  //     });

  //     this.setState({
  //       globalRoles: checkGlobalRoles(user),
  //       projects,
  //       projectsCount,
  //       showSpinner: false
  //     });
  //   } catch (err) {
  //     this.setState({ showSpinner: false });
  //     toast.error("Failed to load projects. Please reload this page.");
  //   }
  // }

  getProjectType = () => {
    return this.state.radioBtnValues.filter(btn => btn.isActive)[0].value;
  }

  reloadProjectsData = async () => {
    const { pageSize: limit, currentPage, searchQuery } = this.state;
    const offset = (currentPage - 1) * limit;
    let projects = [];
    let projectsCount = 0;
    try {
      const { data } = await getProjects(this.getProjectType(), offset, limit, searchQuery);
      projects = data.results;
      projectsCount = data.total;
    
      // parse create time field to user's local time.
      projects = projects.map((p) => {
        p.created_time  = toLocaleTime(p.created);
        return p;
      });

      this.setState({ projects, projectsCount })
    } catch (err) {
      toast.error("Failed to load projects. Please re-try.");
    }
  }

  handleInputChange = (e) => {
    // if input gets cleared, trigger data reload and reset the search query
    if (this.state.searchQuery !== "" && e.target.value === "") {
      this.setState({ currentPage: 1, searchQuery: "" }, () => {
        this.reloadProjectsData();
      });
    } else {
      this.setState({ searchQuery: e.target.value});
    }
  };

  handlePaginationClick = (page) => {
    this.setState({ currentPage: page }, () => {
      this.reloadProjectsData();
    });
  };

  handleProjectTypeChange = (value) => {
    // set isActive field for radio button input style change
    this.setState((prevState) => ({
      radioBtnValues: prevState.radioBtnValues.map((el) =>
        el.value === value
          ? { ...el, isActive: true }
          : { ...el, isActive: false }
      ),
      currentPage: 1
    }), () => {
      this.reloadProjectsData();
    });
  };

  handleProjectsSearch = () =>{
    this.setState({ currentPage: 1 }, () => {
      this.reloadProjectsData();
    });
  }

  raiseInputKeyDown = (e) => {
    const val = e.target.value;
    if ((e.key === "Enter") && val) {
     this.handleProjectsSearch();
    }
  };

  render() {
    const { pageSize, currentPage, globalRoles, projects, showSpinner,
      projectsCount, searchQuery } = this.state;

    return (
      <div className="col-9">
        <div className="d-flex flex-row justify-content-between">
          <div className="d-flex flex-row">
            <h1>Projects</h1>
            <a
              href={portalData.learnArticles.guideToProjectPermissions}
              target="_blank"
              rel="noreferrer"
              className="mt-3"
            >
              <i className="fa fa-question-circle mx-2"></i>
              User Guide
            </a>
          </div>
          {
            (globalRoles.isFacilityOperator || globalRoles.isProjectLead) &&
            <Link to="/projects/new" className="btn btn-primary create-project-btn my-2">
              Create Project
            </Link>
          }
        </div>
        <div className="w-100 input-group my-3">
          <input
            type="text"
            name="query"
            className="form-control"
            placeholder={"Search by Project Name (at least 3 letters) or Project UUID..."}
            value={searchQuery}
            onChange={this.handleInputChange}
            onKeyDown={this.raiseInputKeyDown}
          />
          <div className="input-group-append">
            <button
              className="btn btn-outline-primary"
              type="button"
              onClick={this.handleProjectsSearch}
            >
              Search
            </button>
          </div>
        </div>
        {
          showSpinner && <SpinnerWithText text={"Loading projects..."} />
        }
        {
          !showSpinner && projectsCount === 0 && this.state.radioBtnValues[0].isActive && 
          <div>
            <div className="d-flex flex-row justify-content-between">
              <RadioBtnGroup
                values={this.state.radioBtnValues}
                onChange={this.handleProjectTypeChange}
              />
              {projectsCount} results.
            </div>    
            <div className="alert alert-warning mt-2" role="alert">
              <p className="mt-2">We could not find your project:</p>
              <p>
                <ul>
                  <li>
                    If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">professor or research staff member at your institution</a>, 
                    please <Link to="/user">request to be FABRIC Project Lead</Link> from User Profile -&gt; My Roles &amp; Projects page then you can create a project.
                  </li>
                  <li>
                    If you are a <a href={portalData.learnArticles.guideToProjectRoles} target="_blank" rel="noreferrer">student or other contributor</a>, 
                    please ask your project lead to add you to a project.
                  </li>
                </ul>
              </p>
            </div>
          </div>
        }

        {
          !showSpinner && (projectsCount > 0 || this.state.radioBtnValues[1].isActive)
          && 
          <div>
            <div className="d-flex flex-row justify-content-between mb-3">
              <RadioBtnGroup
                values={this.state.radioBtnValues}
                onChange={this.handleProjectTypeChange}
              />
              {projectsCount} results.
            </div>
            <ProjectsTable
              projects={projects}
              type={this.getProjectType()}
              isFacilityOperator={globalRoles.isFacilityOperator}
            />
            <Pagination
              itemsCount={projectsCount}
              pageSize={pageSize}
              currentPage={currentPage}
              onPageChange={this.handlePaginationClick}
            />
          </div>
        } 
      </div>
    );
  }
}

export default Projects;