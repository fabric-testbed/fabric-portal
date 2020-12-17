import React from "react";
import Joi from "joi-browser";
import Form from "../components/common/Form";
import SideNav from "../components/common/SideNav";
import ProjectUserTable from "../components/Project/ProjectUserTable";
import NewProjectForm from "../components/Project/NewProjectForm";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { getPeopleByName } from "../services/userInformationService";
import { facilityOptions } from "../services/portalData.json";

import {
  getProject,
  saveProject,
  deleteUser,
  addUser,
  updateTags,
} from "../services/projectRegistryService";

import paginate from "../utils/paginate";
import _ from "lodash";

class projectForm extends Form {
  state = {
    data: {
      name: "",
      uuid: "",
      description: "",
      facility: "",
      created_by: {},
      created_time: "",
      project_owners: [],
      project_members: [],
      tags: [],
    },
    projectStaticInfoRows: [
      { label: "Project ID", path: "uuid" },
      { label: "Project Tags", path: "tags" },
      { label: "Created Time", path: "created_time" },
      { label: "Creator Name", path: "created_by.name" },
      { label: "Creator Email", path: "created_by.email" },
      { label: "Creator ID", path: "created_by.uuid" },
    ],
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
    ownerSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
    memberSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
    ownerSearchInput: "",
    memberSearchInput: "",
  };

  schema = {
    uuid: Joi.string().allow(""),
    name: Joi.string().required().label("Name"),
    description: Joi.string().required().label("Description"),
    facility: Joi.string().required().label("Facility"),
    created_by: Joi.object(),
    created_time: Joi.string().allow(""),
    project_members: Joi.array(),
    project_owners: Joi.array(),
    tags: Joi.array(),
  };

  async populateProject() {
    try {
      const projectId = this.props.match.params.id;
      if (projectId === "new") return;

      const { data: project } = await getProject(projectId);
      // keep a shallow copy of project name for project form header
      this.state.originalProjectName = project.name;
      // keep a copy of original tags for comparing on submit.
      this.state.originalTags = project.tags;
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
      uuid: project.uuid,
      name: project.name,
      description: project.description,
      facility: project.facility,
      created_by: project.created_by,
      created_time: project.created_time,
      project_owners: project.project_owners,
      project_members: project.project_members,
      tags: project.tags,
    };
  }

  doSubmit = async () => {
    await saveProject(this.state.data);
    await updateTags(this.state.originalTags, this.state.data);
    this.props.history.push("/projects");
  };

  handleSideNavChange = (newIndex) => {
    // change active item in side nav.
    // change the display of main content of right side accordingly.
    this.setState({ activeIndex: newIndex });
  };

  handleAddUser = async (user) => {
    // call api to update the project by a user.
    if (this.state.activeIndex === 1) {
      const originalUsers = this.state.data.project_owners;
      const users = originalUsers;
      users.push(user);
      this.setState({ data: { ...this.state.data, project_owners: users } });

      await addUser("project_owner", this.state.data.uuid, user.uuid);
    } else if (this.state.activeIndex === 2) {
      const originalUsers = this.state.data.project_members;
      const users = originalUsers;
      users.push(user);
      this.setState({ data: { ...this.state.data, project_members: users } });

      await addUser("project_member", this.state.data.uuid, user.uuid);
    }
  };

  handleSearch = async (value) => {
    // owners/ members are search result.
    if (this.state.activeIndex === 1) {
      this.setState({ ownerSearchInput: value });
      try {
        if (value.length > 3) {
          const { data: owners } = await getPeopleByName(value);
          this.setState({ owners });
        } else {
          this.setState({ owners: [] });
        }
      } catch (err) {
        console.warn(err);
        this.setState({ owners: [] });
      }
    } else if (this.state.activeIndex === 2) {
      this.setState({ memberSearchInput: value });
      try {
        if (value.length > 3) {
          const { data: members } = await getPeopleByName(value);
          this.setState({ members });
        } else {
          this.setState({ members: [] });
        }
      } catch (err) {
        console.warn(err);
        this.setState({ members: [] });
      }
    }
  };

  handleSort = (sortColumn) => {
    if (this.state.activeIndex === 1) {
      this.setState({
        ownerSetting: { ...this.state.ownerSetting, sortColumn: sortColumn },
      });
    } else if (this.state.activeIndex === 2) {
      this.setState({
        memberSetting: { ...this.state.memberSetting, sortColumn: sortColumn },
      });
    }
  };

  handlePageChange = (page) => {
    if (this.state.activeIndex === 1) {
      this.setState({
        ownerSetting: { ...this.state.ownerSetting, currentPage: page },
      });
    } else if (this.state.activeIndex === 2) {
      this.setState({
        memberSetting: { ...this.state.memberSetting, currentPage: page },
      });
    }
  };

  handleDelete = async (user) => {
    if (this.state.activeIndex === 1) {
      const originalUsers = this.state.data.project_owners;
      // update the state of the component.
      // create a new users array without current selected user.
      const users = originalUsers.filter((u) => {
        return u.uuid !== user.uuid;
      });

      // new projects obj will overwrite old one in state
      this.setState({ data: { ...this.state.data, project_owners: users } });

      try {
        await deleteUser("project_owner", this.state.data.uuid, user.uuid);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          console.log("This user has already been deleted");
        this.setState({
          data: { ...this.state.data, project_owners: originalUsers },
        });
      }
    } else if (this.state.activeIndex === 2) {
      const originalUsers = this.state.data.project_members;
      const users = originalUsers.filter((u) => {
        return u.uuid !== user.uuid;
      });

      this.setState({ data: { ...this.state.data, project_members: users } });

      try {
        await deleteUser("project_member", this.state.data.uuid, user.uuid);
      } catch (ex) {
        if (ex.response && ex.response.status === 404)
          console.log("This user has already been deleted");
        this.setState({
          data: { ...this.state.data, project_members: originalUsers },
        });
      }
    }
  };

  getData = (userType) => {
    const { pageSize, currentPage, sortColumn, searchQuery } =
      userType === "project_owner"
        ? this.state.ownerSetting
        : this.state.memberSetting;

    const allUsers =
      userType === "project_owner"
        ? this.state.data.project_owners
        : this.state.data.project_members;

    // filter -> sort -> paginate
    let filtered = allUsers;
    if (searchQuery) {
      filtered = allUsers.filter((u) =>
        u.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    const sorted = _.orderBy(filtered, [sortColumn.path], [sortColumn.order]);

    const users = paginate(sorted, currentPage, pageSize);

    if (userType === "project_owner") {
      return { totalOwnerCount: filtered.length, owners: users };
    } else {
      return { totalMemberCount: filtered.length, members: users };
    }
  };

  renderTags(tags) {
    return tags.map((tag, index) => {
      return (
        <span className="btn-sm btn-info mr-1" key={`tag-${index}`}>
          {tag}
        </span>
      );
    });
  }

  render() {
    const projectId = this.props.match.params.id;
    const that = this;

    if (projectId === "new") {
      return (
        <div className="container">
          <NewProjectForm history={this.props.history} />
        </div>
      );
    } else {
      return (
        <div className="container">
          <h1>Project - {this.state.originalProjectName}</h1>
          <div className="row mt-4">
            <SideNav
              items={this.state.SideNavItems}
              handleChange={this.handleSideNavChange}
            />
            <div
              className={`${this.state.activeIndex !== 0 ? "d-none" : "col-9"}`}
            >
              <form onSubmit={this.handleSubmit}>
                {this.renderInput("name", "Name")}
                {this.renderInput("description", "Description")}
                {this.renderSelect("facility", "Facility", this.state.data.facility, facilityOptions)}
                {this.renderInputTag("tags", "Tags")}
                {this.renderButton("Save")}
              </form>
              <table className="table table-striped table-bordered mt-4">
                <tbody>
                  {this.state.projectStaticInfoRows.map((row, index) => {
                    return (
                      <tr key={`project-basic-info-${index}`}>
                        <td>{row.label}</td>
                        <td>
                          {row.path !== "tags"
                            ? _.get(this.state.data, row.path)
                            : this.renderTags(_.get(this.state.data, row.path))}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <div
              className={`${
                this.state.activeIndex !== 1
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-75">
                <input
                  className="form-control search-owner-input mb-4"
                  value={this.state.ownerSearchInput}
                  placeholder="Search by user name (at least 4 letters) to add more project owners..."
                  onChange={(e) => this.handleSearch(e.currentTarget.value)}
                />
                <ProjectUserTable
                  users={this.state.data.project_owners}
                  sortColumn={this.state.ownerSetting.sortColumn}
                  onSort={this.handleSort}
                  onDelete={this.handleDelete}
                />
              </div>
              <div className="search-result w-25 border ml-2 p-2">
                <ul className="list-group text-center m-2">
                  <li className="list-group-item">Search Result:</li>
                  {this.state.owners.map((user, index) => {
                    return (
                      <li key={index} className="list-group-item">
                        <span>{user.name}</span>
                        <button
                          className="btn btn-sm btn-primary ml-2"
                          onClick={() => that.handleAddUser(user)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
            <div
              className={`${
                this.state.activeIndex !== 2
                  ? "d-none"
                  : "col-9 d-flex flex-row"
              }`}
            >
              <div className="w-75">
                <input
                  className="form-control search-member-input mb-4"
                  placeholder="Search by user name (at least 4 letters) to add more project members..."
                  value={this.state.memberSearchInput}
                  onChange={(e) => this.handleSearch(e.currentTarget.value)}
                />
                <ProjectUserTable
                  users={this.state.data.project_members}
                  sortColumn={this.state.memberSetting.sortColumn}
                  onSort={this.handleSort}
                  onDelete={this.handleDelete}
                />
              </div>
              <div className="search-result w-25 border ml-2 p-2">
                <ul className="list-group text-center m-2">
                  <li className="list-group-item">Search Result:</li>
                  {this.state.members.map((user, index) => {
                    return (
                      <li key={index} className="list-group-item">
                        <span>{user.name}</span>
                        <button
                          className="btn btn-sm btn-primary ml-2"
                          onClick={() => that.handleAddUser(user)}
                        >
                          <FontAwesomeIcon icon={faPlus} />
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>
        </div>
      );
    }
  }
}

export default projectForm;
