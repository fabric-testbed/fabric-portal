import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form.jsx";
import { getProject } from "../services/projectRegistryService";

class projectForm extends Form {
  state = {
    data: {
      name: "",
      description: "",
      facility: "",
    },
    errors: {},
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
  };

  async populateProject() {
    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") return;

      const { data: project } = await getProject(projectId);
      this.setState({ data: this.mapToViewModel(project) });
    } catch (ex) {
      if (ex.response && ex.response.status === 404)
        this.props.history.replace("/not-found");
    }
  }

  async componentDidMount() {
    await this.populateProject();
  }

  mapToViewModel(project) {
    // obj from server -> different kind of obj we can use in this form.
    // obj from server has more data then we need, even hierachical data.
    return {
      _id: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
    };
  }

  render() {
    return (
      <div>
        <h1>Project Form</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("description", "Description")}
          {this.renderInput("facility", "Facility")}
          {this.renderButton("Save")}
        </form>
      </div>
    );
  }
}

export default projectForm;
