import React from "react";
import Joi from "joi-browser";
import withRouter from "../common/withRouter.jsx";
import Form from "../common/Form/Form";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { createProject } from "../../services/projectService";
import { default as portalData } from "../../services/portalData.json";

const ToastMessageWithLink = ({newProject}) => (
  <div className="ms-2">
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
      is_public: "Yes",
      project_lead: "",
      project_type: "research"
    },
    publicOptions: ["Yes", "No"],
    errors: {},
    warningMessage: ""
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    is_public: Joi.string().required().label("Public"),
    project_lead: Joi.string().required().label("Project Lead"),
    project_type: Joi.string().required().label("Project Type"),
  };

  handleCreateProject = async () => {
    const { data } = this.state;
    try {
      // redirect users directly to the projects page
      this.props.navigate("/experiments#projects");
      toast.info("Creation request is in process. You'll receive a message when the project is successfully created.");
      // while the async call is processing under the hood
      const  { data: res } = await createProject(data);
      const newProject = res.results[0];
      // toast message to users when the api call is successfully done.
      toast.success(<ToastMessageWithLink newProject={newProject} />, {autoClose: 10000,});
    }
    catch (err) {
      toast.error("Failed to create project.");
      this.props.navigate("/experiments#projects");
    }
  };

  render() {
    const { publicOptions } = this.state;

    return (
      <div>
        <h1>New Project</h1>
        <div className="alert alert-warning mt-4" role="alert">
          <p>New projects are <b>NOT</b> active when initially created. All new projects require review from FABRIC staff prior to activation.</p>
        </div>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name", true)}
          {this.renderTextarea("description", "Description", true)}
          {this.renderSelect("is_public", "Public", true, "Yes", publicOptions, portalData.helperText.publicProjectDescription)}
          {this.renderInput("project_lead", "Project Lead", true)}
          {this.renderInput("project_type", "Project Type", false)}
        </form>
        <button
          className="btn btn-primary mt-2"
          onClick={this.handleCreateProject}
        >
          Create Project
        </button>
      </div>
    );
  }
}

export default withRouter(NewProjectForm);
