import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form.jsx";
import { getProject } from "../services/projectRegistryService";

class projectForm extends Form {
  state = {
    data: {
      name: "",
      _id: "",
      description: "",
      facility: "",
      created_by: {},
      created_time: "",
      project_members: [],
      project_owners: [],
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
      created_by: project.created_by,
      created_time: project.created_time,
      project_owners: project.project_owners,
      project_members: project.project_members,
    };
  }

  render() {
    return (
      <div className="container">
        <h1>Project - {this.state.data.name}</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("description", "Description")}
          {this.renderInput("facility", "Facility")}
          {this.renderButton("Save")}
        </form>
        <table className="table table-striped table-bordered w-50 my-4">
          <tbody>
            <tr>
              <td>Project ID</td>
              <td>{this.state.data._id}</td>
            </tr>
          </tbody>
        </table>
        <h2 className="my-4">Creator Information</h2>
        <table className="table table-striped table-bordered w-50">
          <tbody>
            <tr>
              <td>Name</td>
              <td>{this.state.data.created_by.name}</td>
            </tr>
            <tr>
              <td>Email</td>
              <td>{this.state.data.created_by.email}</td>
            </tr>
            <tr>
              <td>Creator ID</td>
              <td>{this.state.data.created_by.uuid}</td>
            </tr>
            <tr>
              <td>Created Time</td>
              <td>{this.state.data.created_time}</td>
            </tr>
          </tbody>
        </table>
        <h2 className="my-4">Project Owners</h2>
        <table className="table table-striped table-bordered w-75">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
            {this.state.data.project_owners.map((owner, index) => {
              return (
                <tr key={index}>
                  <td>{owner.name}</td>
                  <td>{owner.email}</td>
                  <td>{owner.uuid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
        <h2 className="my-4">Project Members</h2>
        <table className="table table-striped table-bordered w-75">
          <tbody>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>ID</th>
            </tr>
            {this.state.data.project_members.map((member, index) => {
              return (
                <tr key={index}>
                  <td>{member.name}</td>
                  <td>{member.email}</td>
                  <td>{member.uuid}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default projectForm;
