import React from "react";
import Joi from "joi-browser";

import ProjectUserTable from "./ProjectUserTable";
import Form from "../common/Form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

import { getPeopleByName } from "../../services/userInformationService";
import { saveProject } from "../../services/projectRegistryService";

class NewProjectForm extends Form {
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
    },
    errors: {},
    users: [],
    addedUsers: [],
    activeTableIndex: 0,
    ownerSetting: {
      pageSize: 5,
      currentPage: 1,
      searchQuery: "",
      sortColumn: { path: "name", order: "asc" },
    },
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
  };

  doSubmit = async () => {
    let ownerIDs = this.state.addedUsers.map((user) => user.uuid);
    console.log(ownerIDs);
    let data = { ...this.state.data };
    data.project_owners.push(ownerIDs);
    this.setState({ data });
    console.log("------");
    console.log(this.state.data);
    console.log("-----");
    await saveProject(this.state.data);
    // this.props.history.push("/projects");
  };

  handleSearch = async (value) => {
    try {
      if (value.length > 3) {
        const { data: users } = await getPeopleByName(value);
        this.setState({ users });
      } else {
        this.setState({ users: [] });
      }
    } catch (err) {
      console.warn(err);
      this.setState({ users: [] });
    }
  };

  handleAddUser = (user) => {
    const added = this.state.addedUsers;
    let found = false;
    for (let i = 0; i < added.length; i++) {
      if (added[i].eppn === user.eppn) {
        found = true;
        break;
      }
    }
    if (!found) {
      added.push(user);
      this.setState({ addedUsers: added });
    }
  };

  handleSort = (sortColumn) => {
    if (this.state.activeTableIndex === 0) {
      this.setState({
        ownerSetting: { ...this.state.ownerSetting, sortColumn: sortColumn },
      });
    } else if (this.state.TableactiveIndex === 1) {
      this.setState({
        memberSetting: { ...this.state.memberSetting, sortColumn: sortColumn },
      });
    }
  };

  handleDelete = (user) => {
    // only delete a added user from state, no interaction with api.
    let added = this.state.addedUsers;
    added = added.filter((u) => u.eppn !== user.eppn);
    this.setState({ addedUsers: added });
  };

  render() {
    const that = this;
    return (
      <div>
        <h1>New Project</h1>
        <form onSubmit={this.handleSubmit}>
          {this.renderInput("name", "Name")}
          {this.renderInput("description", "Description")}
          {this.renderInput("facility", "Facility")}
          {this.renderButton("Create")}
        </form>
        <div className="add-project-owner">
          <div className="d-flex flex-row my-4">
            <h6>Project Owners</h6>
            <button
              className="btn btn-sm btn-secondary ml-4"
              onClick={this.handleAddUser}
            >
              Add Item
            </button>
          </div>
        </div>
        <input
          name={this.props.name}
          className="form-control"
          onChange={(e) => this.handleSearch(e.currentTarget.value)}
        />
        <div>
          <ul>
            {this.state.users.map((user, index) => {
              return (
                <li key={index}>
                  {user.name}
                  <button
                    className="btn btn-danger ml-2"
                    onClick={() => that.handleAddUser(user)}
                  >
                    <FontAwesomeIcon icon={faPlus} />
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
        <div>
          <ProjectUserTable
            users={this.state.addedUsers}
            sortColumn={this.state.ownerSetting.sortColumn}
            onSort={this.handleSort}
            onDelete={this.handleDelete}
          />
        </div>
      </div>
    );
  }
}

export default NewProjectForm;
