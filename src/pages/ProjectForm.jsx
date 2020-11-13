import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form.jsx";
import SideNav from "../components/common/SideNav";
import ProjectUserTable from "../components/Project/ProjectUserTable";

import { getProject, saveProject } from "../services/projectRegistryService";
import { getFacilities } from "../services/fakeFacilityService";

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
    facilities: [],
    errors: {},
    SideNavItems: [
      { name: "BASIC INFORMATION", active: true },
      { name: "PROJECT OWNERS", active: false },
      { name: "PROJECT MEMBERS", active: false },
    ],
    activeIndex: 0,
    sortColumn: { path: "name", order: "asc" },
    // componentNames: [BasicInfo, ProjectMembers, ProjectOwners],
  };

  schema = {
    _id: Joi.string(),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    created_by: Joi.string(),
    created_time: Joi.string(),
    project_members: Joi.string(),
    project_owners: Joi.string(),
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

  async populateFacilities() {
    const facilities = getFacilities();
    this.setState({ facilities });
  }

  async componentDidMount() {
    await this.populateProject();
    this.populateFacilities();
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

  doSubmit = async () => {
    await saveProject(this.state.data);

    this.props.history.push("/projects");
  };

  handleChange = (newIndex) => {
    // change active item in side nav.
    this.setState({ activeIndex: newIndex });

    // change the main content of right side.
  };

  handleSort = (sortColumn) => {
    this.setState({ sortColumn });
  };

  render() {
    const projectId = this.props.match.params.id;
    // const TagName = this.state.componentNames[this.state.activeIndex];
    return (
      <div className="container">
        {projectId === "new" ? (
          <h1>New Project</h1>
        ) : (
          <h1>Project - {this.state.data.name}</h1>
        )}
        <div className="row mt-4">
          <SideNav
            items={this.state.SideNavItems}
            handleChange={this.handleChange}
          />
          <div
            className={`${this.state.activeIndex !== 0 ? "d-none" : "col-9"}`}
          >
            <form onSubmit={this.handleSubmit}>
              {this.renderInput("name", "Name")}
              {this.renderInput("description", "Description")}
              {this.renderInput("facility", "Facility")}
              {this.renderButton("Save")}
            </form>
            <table className="table table-striped table-bordered mt-4">
              <tbody>
                <tr>
                  <td>Project ID</td>
                  <td>{this.state.data._id}</td>
                </tr>
                <tr>
                  <td>Creator Name</td>
                  <td>{this.state.data.created_by.name}</td>
                </tr>
                <tr>
                  <td>Creator Email</td>
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
          </div>
          <div
            className={`${this.state.activeIndex !== 1 ? "d-none" : "col-9"}`}
          >
            <h2 className="my-4">Project Owners</h2>
            <ProjectUserTable
              users={this.state.data.project_owners}
              sortColumn={this.state.sortColumn}
              onSort={this.handleSort}
              // onDelete={this.handleDelete}
            />
          </div>
          <div
            className={`${this.state.activeIndex !== 2 ? "d-none" : "col-9"}`}
          >
            <h2 className="my-4">Project Members</h2>
            <ProjectUserTable
              users={this.state.data.project_members}
              sortColumn={this.state.sortColumn}
              onSort={this.handleSort}
              // onDelete={this.handleDelete}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default projectForm;
