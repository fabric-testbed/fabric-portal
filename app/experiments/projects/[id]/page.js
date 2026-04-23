"use client";

import { useState, useEffect, useCallback } from "react";
import Joi from "joi";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";
import moment from "moment";
import Parser from "html-react-parser";

// hooks
import useForm from "@/lib/hooks/useForm";

// components
import Input from "@/components/common/Form/Input";
import Select from "@/components/common/Form/Select";
import Wysiwyg from "@/components/common/Form/Wysiwyg";
import InputCheckboxes from "@/components/common/InputCheckboxes";
import SideNav from "@/components/common/SideNav";
import SpinnerFullPage from "@/components/common/SpinnerFullPage";
import ArtifactListPage from "@/components/Artifacts/ArtifactListPage";
import ProjectMemberships from "@/components/Project/Personnel/ProjectMemberships";
import ProjectProfile from "@/components/Project/ProjectProfile";
import ProjectBasicInfoTable from "@/components/Project/ProjectBasicInfoTable";
import PersistentStorage from "@/components/Project/Storage/PersistentStorage";
import NewProjectForm from "@/components/Project/NewProjectForm";
import Slices from "@/components/Experiment/Slices";

// services
import portalData from "@/services/portalData.json";
import { getCurrentUser } from "@/services/peopleService";
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
  updateProjectTopics,
  updateProjectReviewStatus,
} from "@/services/projectService";
import sleep from "@/utils/sleep";

// lib
import checkGlobalRoles from "@/lib/permissions/checkGlobalRoles";

// utils
import utcToLocalTimeParser from "@/utils/utcToLocalTimeParser";
import { OverlayTrigger, Tooltip } from "react-bootstrap";
import { HelpCircle, LogIn, AlertTriangle } from "lucide-react";


const projectAllOptions = ["show_project_owners", "show_project_members"];

const optionsDisplayMapping = {
  show_project_owners: "Project Owners",
  show_project_members: "Project Members",
};

const publicOptions = ["Yes", "No"];

const formSchema = {
  uuid: Joi.string().allow(""),
  name: Joi.string().required().label("Name"),
  description: Joi.string().required().label("Description"),
  facility: Joi.string().required().label("Facility"),
  tags: Joi.array(),
  expired: Joi.string().allow(""),
  modified: Joi.string().allow(""),
  created: Joi.string().allow(""),
  lead_name: Joi.string().allow(""),
  lead_id: Joi.string().allow(""),
  lead_email: Joi.string().allow(""),
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
  communities: Joi.array(),
  topics: Joi.array(),
};

const initialData = {
  uuid: "",
  name: "",
  description: "",
  facility: "",
  tags: [],
  expired: "",
  modified: "",
  created: "",
  lead_name: "",
  lead_id: "",
  lead_email: "",
  is_creator: false,
  is_member: false,
  is_owner: false,
  is_token_holder: false,
  is_public: false,
  is_locked: false,
  project_type: "research",
  allOptions: projectAllOptions,
  selectedOptions: [],
  project_funding: [],
  communities: [],
  topics: [],
};

function mapToViewModel(project) {
  return {
    uuid: project.uuid,
    name: project.name,
    description: project.description,
    facility: project.facility,
    tags: project.tags,
    expired: project.expires_on,
    modified: project.modified,
    created: project.created,
    lead_name: project.project_lead.name,
    lead_id: project.project_lead.uuid,
    lead_email: project.project_lead.email,
    is_creator: project.memberships.is_creator,
    is_member: project.memberships.is_member,
    is_owner: project.memberships.is_owner,
    is_token_holder: project.memberships.is_token_holder,
    is_public: project.is_public ? "Yes" : "No",
    project_type: project.project_type,
    is_locked: project.is_locked,
    allOptions: projectAllOptions,
    selectedOptions: Object.keys(project.preferences).filter(
      (key) => project.preferences[key] && projectAllOptions.includes(key)
    ),
    project_funding: project.project_funding,
    topics: project.topics,
    communities: project.communities,
  };
}

function checkProjectExpiration(expirationTime) {
  if (expirationTime) {
    const utcDateTime = expirationTime.substring(0, 19);
    const stillUtc = moment.utc(utcDateTime).toDate();
    return stillUtc < new Date();
  }
  return false;
}

function checkProjectExpireInOneMonth(expirationTime) {
  if (expirationTime) {
    const utcDateTime = expirationTime.substring(0, 19);
    const stillUtc = moment.utc(utcDateTime).toDate();
    return stillUtc < moment(new Date()).add(1, "M");
  }
  return false;
}

export default function ProjectFormPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id;

  const { data, setData, errors, handleChange, handleSubmit, handleInputBoxCheck, handleWysiwygChange } =
    useForm(initialData, formSchema, null);

  const [originalProject, setOriginalProject] = useState({ name: "", profile: { references: [] } });
  const [user, setUser] = useState({});
  const [globalRoles, setGlobalRoles] = useState({
    isProjectAdmin: false,
    isFacilityOperator: false,
    isActiveUser: false,
    isJupterhubUser: false,
  });
  const [isActive, setIsActive] = useState(true);
  const [activeIndex, setActiveIndex] = useState(0);
  const [SideNavItems, setSideNavItems] = useState([
    { name: "BASIC INFORMATION", active: true },
    { name: "PROJECT MEMBERSHIPS", active: false },
    { name: "SLICES", active: false },
    { name: "PERSISTENT STORAGE", active: false },
    { name: "PROJECT ARTIFACTS", active: false },
  ]);
  const [owners, setOwners] = useState([]);
  const [members, setMembers] = useState([]);
  const [tokenHolders, setTokenHolders] = useState([]);
  const [membershipsKey, setMembershipsKey] = useState(0);
  const [tagVocabulary, setTagVocabulary] = useState([]);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showSpinner, setShowSpinner] = useState(false);
  const [spinner, setSpinner] = useState({ text: "", btnText: "", btnPath: "" });
  const [selectedTags, setSelectedTags] = useState([]);
  const [originalTags, setOriginalTags] = useState([]);
  const [projectFunding, setProjectFunding] = useState([]);
  const [communities, setCommunities] = useState([]);
  const [fabricMatrix, setFabricMatrix] = useState("");
  const [topics, setTopics] = useState([]);

  const populateProject = useCallback(
    async (roles) => {
      if (projectId === "new") {
        setIsInitialLoading(false);
        return;
      }

      try {
        const { data: projectData } = await getProjectById(projectId);
        const project = projectData.results[0];

        if (
          project.memberships &&
          !project.memberships.is_creator &&
          !project.memberships.is_member &&
          !project.memberships.is_owner &&
          !roles.isFacilityOperator
        ) {
          setData(project);
          setFabricMatrix(
            project.profile.references.length > 0 ? project.profile.references["fabric_matrix"] : ""
          );
        } else {
          setOriginalProject(project);
          setData(mapToViewModel(project));
          setFabricMatrix(
            project.profile.references.length > 0 ? project.profile.references[0].url : ""
          );
          setProjectFunding(project.project_funding);
          setTopics(project.topics);
          setCommunities(project.communities);
          setOwners(project.project_owners);
          setMembers(project.project_members);
          setTokenHolders(project.token_holders);
          setSelectedTags(project.tags);
          setOriginalTags(project.tags);
          setIsActive(project.active);
        }
        setIsInitialLoading(false);
      } catch (err) {
        setIsInitialLoading(false);
        toast.error("Failed to load project.");
        if (err.response && err.response.status === 404) {
          router.push("/about/not-found");
        }
      }
    },
    [projectId, router, setData]
  );

  useEffect(() => {
    async function init() {
      // use url anchor for tab display
      const hash = window.location.hash;
      const activeMap = {
        "#info": 0,
        "#memberships": 1,
        "#slices": 2,
        "#volumes": 3,
        "#artifacts": 4,
      };

      if (hash && activeMap[hash] !== undefined) {
        setActiveIndex(activeMap[hash]);
        setSideNavItems([
          { name: "BASIC INFORMATION", active: hash === "#info" },
          { name: "PROJECT MEMBERSHIPS", active: hash === "#memberships" },
          { name: "SLICES", active: hash === "#slices" },
          { name: "PERSISTENT STORAGE", active: hash === "#volumes" },
          { name: "PROJECT ARTIFACTS", active: hash === "#artifacts" },
        ]);
      }

      try {
        const { data: res1 } = await getProjectTags();
        setTagVocabulary(res1.results);
      } catch (err) {
        toast.error("Failed to get tags.");
      }

      let roles = globalRoles;
      try {
        const { data: res2 } = await getCurrentUser();
        setUser(res2.results[0]);
        roles = checkGlobalRoles(res2.results[0]);
        setGlobalRoles(roles);
      } catch (err) {
        toast.error("User's credential is expired. Please re-login.");
        router.push("/experiments/projects");
        return;
      }

      await populateProject(roles);
    }

    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const parsePreferences = () => {
    const preferences = {};
    for (const option of projectAllOptions) {
      preferences[option] = data.selectedOptions.includes(option);
    }
    return preferences;
  };

  const handleUpdateProject = async () => {
    setShowSpinner(true);
    setSpinner({ text: "Updating project...", btnText: "", btnPath: "" });

    const originalMatrix =
      originalProject.profile.references.length > 0 ? originalProject.profile.references[0].url : "";
    try {
      await updateProject(data, parsePreferences());
      await updateProjectFunding(data.uuid, projectFunding);
      await updateProjectCommunity(data.uuid, communities);
      await updateProjectTopics(data.uuid, topics);
      if (fabricMatrix !== originalMatrix) {
        await updateMatrix(data.uuid, fabricMatrix);
      }
      window.location.reload();
      toast.success("Project updated successfully!");
    } catch (err) {
      setShowSpinner(false);
      setSpinner({ text: "", btnText: "", btnPath: "" });
      toast.error("Failed to save project.");
    }
    router.push(`/projects/${data.uuid}`);
  };

  const handleTagCheck = (option) => {
    if (option === "all") {
      setSelectedTags((prev) => (prev.length === tagVocabulary.length ? [] : tagVocabulary));
    } else {
      setSelectedTags((prev) =>
        prev.includes(option) ? prev.filter((o) => o !== option) : [...prev, option]
      );
    }
  };

  const handleUpdateFunding = (operation, funding) => {
    if (operation === "add") {
      setProjectFunding((prev) => [...prev, funding]);
    } else if (operation === "remove") {
      setProjectFunding((prev) =>
        prev.filter((f) => JSON.stringify(f) !== JSON.stringify(funding))
      );
    }
  };

  const handleUpdateCommunity = (operation, community) => {
    if (operation === "add") {
      setCommunities((prev) => [...prev, community]);
    } else if (operation === "remove") {
      setCommunities((prev) => prev.filter((c) => c !== community));
    }
  };

  const handleUpdateMatrix = (e) => {
    setFabricMatrix(e.target.value);
  };

  const handlePermissionUpdate = async () => {
    setShowSpinner(true);
    setSpinner({ text: "Updating project permissions...", btnText: "", btnPath: "" });
    try {
      await updateTags(data.uuid, selectedTags);
      setOriginalTags(selectedTags);
      toast.success("Permissions updated successfully.");
    } catch (err) {
      toast.error("Failed to save project permissions.");
    }
    setShowSpinner(false);
    setSpinner({ text: "", btnText: "", btnPath: "" });
  };

  const handleSideNavChange = (newIndex) => {
    const indexToHash = { 0: "#info", 1: "#memberships", 2: "#slices", 3: "#volumes", 4: "#artifacts" };
    setActiveIndex(newIndex);
    setSideNavItems([
      { name: "BASIC INFORMATION", active: newIndex === 0 },
      { name: "PROJECT MEMBERSHIPS", active: newIndex === 1 },
      { name: "SLICES", active: newIndex === 2 },
      { name: "PERSISTENT STORAGE", active: newIndex === 3 },
      { name: "PROJECT ARTIFACTS", active: newIndex === 4 },
    ]);
    router.push(`/experiments/projects/${projectId}${indexToHash[newIndex]}`);
  };

  const handleDeleteProject = async (project) => {
    try {
      router.push("/experiments/projects");
      toast.info("Deletion request is in process. You'll receive a message when the project is successfully deleted.");
      await deleteProject(project.uuid);
      toast.success("Project deleted successfully.");
    } catch (err) {
      toast.error("Failed to delete project.");
      router.push("/experiments/projects");
    }
  };

  const handlePersonnelUpdate = (personnelType, userIDs, operation) => {
    setShowSpinner(true);
    setSpinner({
      text: `Updating ${personnelType}... This process may take a while. Please feel free to use other portal features while waiting. You will receive a message when the update is completed.`,
      btnText: "Back to Project List",
      btnPath: "/experiments/projects",
    });

    updateProjectPersonnel(data.uuid, userIDs, operation, personnelType)
      .then(async () => {
        try {
          const { data: projectData } = await getProjectById(projectId);
          const project = projectData.results[0];
          setOwners(project.project_owners);
          setMembers(project.project_members);
        } catch {
          // ignore refresh error; data will be stale until manual reload
        }
        setShowSpinner(false);
        setSpinner({ text: "", btnText: "", btnPath: "" });
        setMembershipsKey(k => k + 1);
        toast.success(`${personnelType} updated successfully.`);
      })
      .catch(() => {
        setShowSpinner(false);
        setSpinner({ text: "", btnText: "", btnPath: "" });
        toast.error(`Failed to update ${personnelType}.`);
      });
  };

  const handleUpdateTokenHolders = (personnelType, tokenHolderIDs, operation) => {
    setShowSpinner(true);
    setSpinner({
      text: "Updating token holders... This process may take a while. Please feel free to use other portal features while waiting. You will receive a message when the update is completed.",
      btnText: "Back to Project List",
      btnPath: "/experiments/projects",
    });

    updateProjectTokenHolders(data.uuid, operation, tokenHolderIDs)
      .then(async () => {
        try {
          const { data: projectData } = await getProjectById(projectId);
          const project = projectData.results[0];
          setTokenHolders(project.token_holders);
          setMembers(project.project_members);
        } catch {
          // ignore refresh error
        }
        setShowSpinner(false);
        setSpinner({ text: "", btnText: "", btnPath: "" });
        setMembershipsKey(k => k + 1);
        toast.success("Token holders updated successfully.");
      })
      .catch(() => {
        setShowSpinner(false);
        setSpinner({ text: "", btnText: "", btnPath: "" });
        toast.error("Failed to update token holders.");
      });
  };

  const handleUpdateTopics = (newTopics) => {
    setTopics(newTopics);
  };

  const handleToggleReviewSwitch = async () => {
    const newStatus = !isActive;
    setShowSpinner(true);
    setSpinner({ text: "Updating project review status...", btnText: "", btnPath: "" });
    try {
      await updateProjectReviewStatus(data.uuid, !newStatus);
      toast.success("Project review status updated successfully.");
      await sleep(1000);
      window.location.reload();
    } catch (err) {
      toast.error("Failed to update project review status.");
      setShowSpinner(false);
      setSpinner({ text: "", btnText: "", btnPath: "" });
    }
  };

  const canUpdate =
    !checkProjectExpiration(data.expired) &&
    (globalRoles.isFacilityOperator || data.is_creator || data.is_owner);

  const urlSuffix = `email=${user.email}&customfield_10058=${data.uuid}&customfield_10059=${encodeURIComponent(data.name)}`;

  const renderTooltip = (id, content) => (
    <Tooltip id={id}>{content}</Tooltip>
  );

  if (isInitialLoading) {
    return (
      <div className="container">
        <div className="d-flex flex-row justify-content-between my-3">
          <div className="skeleton-title" style={{ width: "35%" }} />
          <div className="skeleton-block" style={{ width: "160px", height: "2rem" }} />
        </div>
        <div className="row mt-4">
          <div className="col-3">
            {[80, 90, 75, 85, 70].map((w, i) => (
              <div key={i} className="skeleton-text mb-4" style={{ width: `${w}%` }} />
            ))}
          </div>
          <div className="col-9">
            <div className="skeleton-text mb-1" style={{ width: "12%" }} />
            <div className="skeleton-block mb-4" style={{ height: "2.25rem" }} />
            <div className="skeleton-text mb-1" style={{ width: "18%" }} />
            <div className="skeleton-block mb-4" style={{ height: "8rem" }} />
            <div className="skeleton-text mb-1" style={{ width: "10%" }} />
            <div className="skeleton-block mb-4" style={{ height: "2.25rem" }} />
            <div className="skeleton-text mb-1" style={{ width: "8%" }} />
            <div className="skeleton-block mb-4" style={{ height: "2.25rem" }} />
            <div className="skeleton-text mb-1" style={{ width: "15%" }} />
            <div className="skeleton-block mb-4" style={{ height: "2.25rem" }} />
          </div>
        </div>
      </div>
    );
  }

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
    );
  }

  if (data.is_locked && !checkProjectExpiration(data.expired)) {
    return (
      <div className="container">
        <SpinnerFullPage
          showSpinner={true}
          text="This project is locked because an update is in process. Please feel free to use other portal features while waiting. You will receive a message when the update is completed. "
          btnText="Back to Project list"
          btnPath="/experiments/projects"
        />
      </div>
    );
  }

  // 1. New project.
  if (projectId === "new") {
    return (
      <div className="container">
        <NewProjectForm />
      </div>
    );
  }

  // 2. View public project.
  if (!data.is_owner && !data.is_member && !data.is_creator && !globalRoles.isFacilityOperator) {
    return (
      <div className="container">
        <ProjectProfile project={data} />
      </div>
    );
  }

  // 3. Show detailed project form for PC/PO/PM or FO.
  return (
    <div className="container">
      <div className="d-flex flex-row justify-content-between">
        <h1>{originalProject.name}</h1>
        {canUpdate ? (
          <div className="d-flex flex-row justify-content-end">
            <button
              type="button"
              className="btn btn-sm btn-outline-success me-2 my-3"
              onClick={() =>
                window.open(`${portalData.jiraLinks.projectPermissionRequest}?${urlSuffix}`, "_blank")
              }
            >
              <LogIn size={14} className="me-2" />
              Request Permissions
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline-success me-2 my-3"
              onClick={() =>
                window.open(`${portalData.jiraLinks.storageRequest}?${urlSuffix}`, "_blank")
              }
            >
              <LogIn size={14} className="me-2" />
              Request Storage
            </button>
            <Link href="/experiments/projects">
              <button className="btn btn-sm btn-outline-primary my-3">
                <LogIn size={14} className="me-2" />
                Back to Project List
              </button>
            </Link>
          </div>
        ) : (
          <Link href="/experiments/projects">
            <button className="btn btn-sm btn-outline-primary my-3">
              <LogIn size={14} className="me-2" />
              Back to Project List
            </button>
          </Link>
        )}
      </div>
      {checkProjectExpiration(data.expired) && (
        <div
          className="alert alert-danger mb-2 d-flex flex-row justify-content-between align-items-center"
          role="alert"
        >
          <span>
            <AlertTriangle size={14} className="me-2" />
            This project is expired and no operations are allowed. Please submit a ticket to renew the project.
          </span>
          <button
            type="button"
            className="btn btn-sm btn-success"
            onClick={() =>
              window.open(`${portalData.jiraLinks.renewProjectRequest}?${urlSuffix}`, "_blank")
            }
          >
            <LogIn size={14} className="me-2" />
            Renew Project
          </button>
        </div>
      )}
      {!checkProjectExpiration(data.expired) && checkProjectExpireInOneMonth(data.expired) && (
        <div
          className="alert alert-warning mb-2 d-flex flex-row justify-content-between align-items-center"
          role="alert"
        >
          <div>
            <AlertTriangle size={14} className="me-2" />
            This project is going to expire in a month on {utcToLocalTimeParser(data.expired)}.
            {canUpdate ? (
              <span> Please submit a ticket to renew the project.</span>
            ) : (
              <span> Please contact your project owner to request project renewal.</span>
            )}
          </div>
          {canUpdate ? (
            <button
              type="button"
              className="btn btn-sm btn-success"
              onClick={() =>
                window.open(`${portalData.jiraLinks.renewProjectRequest}?${urlSuffix}`, "_blank")
              }
            >
              <LogIn size={14} className="me-2" />
              Renew Project
            </button>
          ) : (
            <div></div>
          )}
        </div>
      )}
      <div className="row mt-4">
        <div className="col-3">
          <SideNav items={SideNavItems} handleChange={handleSideNavChange} />
        </div>
        <div className={`${activeIndex === 0 ? "col-9" : "d-none"}`}>
          {(globalRoles.isFacilityOperator || globalRoles.isProjectAdmin) && (
            <div
              className="alert alert-primary mb-2 d-flex flex-row justify-content-between align-items-center"
              role="alert"
            >
              <span>
                For Facility Operator and Project Admin Only: Toggle the switch to set the project as active or inactive after review.
              </span>
              <div className="form-check form-switch">
                <input
                  className="form-check-input mt-2"
                  type="checkbox"
                  role="switch"
                  id="ReviewSwitchCheck"
                  checked={isActive}
                  onChange={handleToggleReviewSwitch}
                />
                <label className="form-check-label mt-1" htmlFor="ReviewSwitchCheck">
                  Active
                </label>
              </div>
            </div>
          )}
          {!checkProjectExpiration(data.expired) && isActive === false && (
            <div
              className="alert alert-warning mb-2 d-flex flex-row justify-content-between align-items-center"
              role="alert"
            >
              <span>
                This project is currently under review{" "}
                <a
                  href={portalData.learnArticles.guideForProjectReview}
                  target="_blank"
                  rel="noreferrer"
                  className="ms-1"
                >
                  <HelpCircle size={14} />
                </a>
                . If you are a Project Owner, please update the project information to include more details for the review.
                You can also update project memberships to add more project members or owners if needed.
              </span>
            </div>
          )}
          <form onSubmit={handleSubmit}>
            <Input
              type="text"
              name="name"
              value={data.name}
              label="Name"
              onChange={handleChange}
              error={errors.name}
              disabled={!canUpdate}
            />
            {canUpdate ? (
              <Wysiwyg
                name="description"
                content={data.description}
                label="Description"
                onChange={handleWysiwygChange}
                error={errors.description}
              />
            ) : (
              <div className="form-group">
                <label htmlFor="projectDescription">Description</label>
                <div className="disabled-project-description">
                  {Parser(data.description || "")}
                </div>
              </div>
            )}
            <Select
              name="facility"
              value={data.facility}
              label="Facility"
              currentOption={data.facility}
              options={portalData.facilityOptions}
              onChange={handleChange}
              error={errors.facility}
              disabled={!canUpdate}
            />
            <Select
              name="is_public"
              value={data.is_public}
              label="Public"
              currentOption={data.is_public}
              options={publicOptions}
              onChange={handleChange}
              error={errors.is_public}
              disabled={!canUpdate}
              tooltip={portalData.helperText.publicProjectDescription}
            />
            <Select
              name="project_type"
              value={data.project_type}
              label="Project Type"
              currentOption={data.project_type}
              options={portalData.projectTypeOptions}
              onChange={handleChange}
              error={errors.project_type}
              disabled={!canUpdate}
            />
            {data.is_public === "Yes" && (
              <div className="form-group w-100">
                <label htmlFor="preferences">
                  Privacy Preferences
                  <OverlayTrigger
                    placement="right"
                    delay={{ show: 100, hide: 300 }}
                    overlay={renderTooltip(
                      "select-tooltip",
                      portalData.helperText.privacyPreferencesDescription
                    )}
                  >
                    <HelpCircle className="mx-2 text-secondary" size={16} />
                  </OverlayTrigger>
                </label>
                <InputCheckboxes
                  allOptions={data.allOptions}
                  selectedOptions={data.selectedOptions}
                  optionsDisplayMapping={optionsDisplayMapping}
                  showSelectAll={false}
                  optionDirection="row"
                  onCheck={handleInputBoxCheck}
                  key={`input-check-boxes-${data.selectedOptions.length}`}
                  disabled={!canUpdate}
                />
              </div>
            )}
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
            onDeleteProject={handleDeleteProject}
            onFundingUpdate={handleUpdateFunding}
            onMatrixUpdate={handleUpdateMatrix}
            onCommunityUpdate={handleUpdateCommunity}
            onUpdateProject={handleUpdateProject}
            onTagChange={handleUpdateTopics}
          />
          {globalRoles.isFacilityOperator && (
            <div className="border-top my-2">
              <h5 className="my-2">Project Permissions</h5>
              <InputCheckboxes
                allOptions={tagVocabulary}
                selectedOptions={selectedTags}
                showSelectAll={true}
                optionDirection="row"
                onCheck={handleTagCheck}
                key={`project-permissions-${selectedTags.length}`}
              />
              <button className="btn btn-primary mt-2" onClick={handlePermissionUpdate}>
                Update Permissions
              </button>
            </div>
          )}
        </div>
        <div className={`${activeIndex === 1 ? "col-9 d-flex flex-row" : "d-none"}`}>
          <div className="w-100">
            <ProjectMemberships
              key={membershipsKey}
              canUpdate={canUpdate}
              owners={owners}
              members={members}
              token_holders={tokenHolders}
              urlSuffix={urlSuffix}
              isTokenHolder={data.is_token_holder}
              isFO={globalRoles.isFacilityOperator}
              projectActive={isActive}
              projectExpired={checkProjectExpiration(data.expired)}
              onUpdateTokenHolders={handleUpdateTokenHolders}
              onUpdateUsers={handlePersonnelUpdate}
            />
          </div>
        </div>
        <div className={`${activeIndex === 2 ? "col-9 d-flex flex-row" : "d-none"}`}>
          <div className="w-100">
            {activeIndex === 2 && (
              <Slices
                parent="Projects"
                projectId={data.uuid}
                isProjectExpired={checkProjectExpiration(data.expired)}
                isActive={isActive}
              />
            )}
          </div>
        </div>
        <div className={`${activeIndex === 3 ? "col-9 d-flex flex-row" : "d-none"}`}>
          <div className="w-100">
            {activeIndex === 3 && (
              <PersistentStorage parent="Projects" projectId={data.uuid} />
            )}
          </div>
        </div>
        <div className={`${activeIndex === 4 ? "col-9 d-flex flex-row" : "d-none"}`}>
          <div className="w-100">
            {activeIndex === 4 && (
              <ArtifactListPage parent="Projects" projectId={data.uuid} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
