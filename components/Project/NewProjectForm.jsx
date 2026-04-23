"use client";
import { useState } from "react";
import Joi from "joi";
import { useRouter } from "next/navigation";
import useForm from "@/lib/hooks/useForm";
import Input from "../common/Form/Input";
import Textarea from "../common/Form/Textarea";
import Select from "../common/Form/Select";
import { toast } from "react-toastify";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { createProject } from "../../services/projectService";
import { default as portalData } from "../../services/portalData.json";

const ToastMessageWithLink = ({ newProject }) => (
  <div className="ms-2">
    <p className="mb-1">Project created successfully.</p>
    <Link href={`/experiments/projects/${newProject.uuid}`}>
      <button className="btn btn-sm btn-primary mt-1">
        View New Project
      </button>
    </Link>
  </div>
);

const schema = {
  uuid: Joi.string().allow(""),
  name: Joi.string().required().label("Name"),
  description: Joi.string().required().label("Description"),
  facility: Joi.string().required().label("Facility"),
  is_public: Joi.string().required().label("Public"),
  project_lead: Joi.string().required().label("Project Lead"),
  project_type: Joi.string().required().label("Project Type"),
};

const publicOptions = ["Yes", "No"];

export default function NewProjectForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { data, errors, handleChange, handleSubmit } = useForm(
    {
      name: "",
      uuid: "",
      description: "",
      facility: portalData.defaultFacility,
      is_public: "Yes",
      project_lead: "",
      project_type: "research",
    },
    schema,
    null
  );

  const handleCreateProject = async () => {
    setIsLoading(true);
    try {
      toast.info("Creation request is in process. You'll receive a message when the project is successfully created.");
      const { data: res } = await createProject(data);
      const newProject = res.results[0];
      toast.success(<ToastMessageWithLink newProject={newProject} />, { autoClose: 10000 });
      router.push("/experiments/projects");
    } catch (err) {
      toast.error("Failed to create project.");
      setIsLoading(false);
      router.push("/experiments/projects");
    }
  };

  return (
    <div>
      <h1>New Project</h1>
      <div className="alert alert-warning mt-4" role="alert">
        <p>New projects are <b>NOT</b> active when initially created. All new projects require review from FABRIC staff prior to activation.</p>
      </div>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          name="name"
          value={data.name}
          label="Name"
          onChange={handleChange}
          error={errors.name}
        />
        <Textarea
          type="text"
          name="description"
          value={data.description}
          label="Description"
          onChange={handleChange}
          error={errors.description}
        />
        <Select
          name="facility"
          value={data.facility}
          label="Facility"
          currentOption={portalData.defaultFacility}
          options={portalData.facilityOptions}
          onChange={handleChange}
          error={errors.facility}
        />
        <Select
          name="is_public"
          value={data.is_public}
          label="Public"
          currentOption="Yes"
          options={publicOptions}
          onChange={handleChange}
          error={errors.is_public}
          tooltip={portalData.helperText.publicProjectDescription}
        />
        <Input
          type="text"
          name="project_lead"
          value={data.project_lead}
          label="Project Lead"
          onChange={handleChange}
          error={errors.project_lead}
          placeholder="Paste the user UUID here"
        />
        <Input
          type="text"
          name="project_type"
          value={data.project_type}
          label="Project Type"
          onChange={handleChange}
          error={errors.project_type}
          disabled={true}
        />
      </form>
      <button
        className="btn btn-primary mt-2"
        onClick={handleCreateProject}
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="me-2 spin-icon" size={16} />}
        {isLoading ? "Creating..." : "Create Project"}
      </button>
    </div>
  );
}
